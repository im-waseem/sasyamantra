"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Leaf, ShoppingCart, User, Shield, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabaseClient";

interface UserType {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface ProfileType {
  id: string;
  role: string;
  full_name?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Feedback", href: "/feedback" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setCartOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user and profile
  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching user data...');

      // Get session first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setUser(null);
        setProfile(null);
        return;
      }

      const currentUser = sessionData?.session?.user || null;
      console.log('👤 Current user:', currentUser?.id, currentUser?.email);
      
      if (currentUser) {
        const userTypeData: UserType = {
          id: currentUser.id,
          email: currentUser.email,
          user_metadata: currentUser.user_metadata
        };
        setUser(userTypeData);

        // Fetch profile with detailed logging
        console.log('🔍 Fetching profile for user:', currentUser.id);
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, role, full_name")
          .eq("id", currentUser.id)
          .single();

        console.log('📊 Profile query result:', { profileData, error });

        if (!error && profileData) {
          setProfile(profileData);
          console.log('✅ Profile loaded:', profileData);
        } else if (error?.code === 'PGRST116') {
          // Create profile if not exists
          console.log('🆕 Creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: currentUser.id,
              role: 'user', // Default role
              full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
            })
            .select()
            .single();
          
          if (!createError && newProfile) {
            setProfile(newProfile);
            console.log('✅ New profile created:', newProfile);
          } else {
            console.error('❌ Profile creation error:', createError);
          }
        } else {
          console.error('❌ Profile fetch error:', error);
        }
      } else {
        console.log('❌ No user session found');
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    } finally {
      setLoading(false);
      console.log('✅ User data fetch completed');
    }
  };

  useEffect(() => {
    fetchUserData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      if (['SIGNED_IN','SIGNED_OUT','TOKEN_REFRESHED'].includes(event)) {
        fetchUserData();
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setUserMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Enhanced admin access function
  const handleAdminAccess = async () => {
    console.log('🛡️ Admin access clicked - Current state:', { 
      user: user ? `${user.id} (${user.email})` : null,
      profile: profile,
      role: profile?.role,
      loading 
    });

    setUserMenuOpen(false);

    // Check if we're still loading
    if (loading) {
      console.log('⏳ Still loading user data, please wait...');
      alert('Loading user data, please wait...');
      return;
    }

    // Check if user is logged in
    if (!user) {
      console.log('❌ No user found, redirecting to login');
      alert('Please log in first');
      router.push('/login');
      return;
    }

    // Check if profile is loaded
    if (!profile) {
      console.log('⚠️ Profile not loaded, attempting to fetch...');
      await fetchUserData();
      
      // Double-check after fetching
      if (!profile) {
        console.log('❌ Still no profile after fetch');
        alert('Unable to load user profile. Please try refreshing the page.');
        return;
      }
    }

    // Check admin role
    console.log('🔍 Checking admin role:', profile.role);
    if (profile.role !== 'admin') {
      console.log('❌ Access denied - User role:', profile.role);
      alert(`Access denied. Your role: ${profile.role}. Admin privileges required.`);
      return;
    }

    // Navigate to admin dashboard
    console.log('✅ Navigating to admin dashboard...');
    try {
      router.push('/admin');
      console.log('🔄 Router.push executed');
    } catch (routerError) {
      console.error('❌ Router push error:', routerError);
      alert('Navigation error. Please try again.');
    }
  };

  // Debug function - temporary
  const debugUserState = () => {
    console.log('🐛 DEBUG STATE:', {
      loading,
      user: user ? { id: user.id, email: user.email } : null,
      profile,
      pathname,
      timestamp: new Date().toISOString()
    });
    alert(`Debug Info:\nLoading: ${loading}\nUser: ${user?.email || 'None'}\nProfile Role: ${profile?.role || 'None'}\nPathname: ${pathname}`);
  };

  const cartTotal = state.items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  const cartItemCount = state.items?.reduce((count, item) => count + item.quantity, 0) || 0;

  const getDisplayName = () => profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Don't render navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    console.log('🚫 Admin route detected, hiding navbar');
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sasya Mantra</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Debug Button - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={debugUserState}
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded border"
                title="Debug user state"
              >
                DEBUG
              </button>
            )}

            {user && !loading && (
              <>
                {profile?.role !== "admin" && (
                  <>
                    <Link
                      href="/order-history"
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === '/order-history' ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                      }`}
                    >
                      Orders
                    </Link>

                    {/* Cart Dropdown */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => { setCartOpen(!cartOpen); setUserMenuOpen(false); }}
                        className="relative flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5 mr-1" />
                        <span className="mr-1">Cart</span>
                        {cartItemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                            {cartItemCount}
                          </span>
                        )}
                      </button>

                      {cartOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Shopping Cart</h3>
                            {state.items?.length ? (
                              <>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                  {state.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} × ₹{item.price.toFixed(2)}</p>
                                      </div>
                                      <div className="text-sm font-semibold text-green-600">
                                        ₹{(item.quantity * item.price).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-gray-800">Total:</span>
                                    <span className="font-bold text-green-600 text-lg">₹{cartTotal.toFixed(2)}</span>
                                  </div>
                                  <Link
                                    href="/cart"
                                    onClick={() => setCartOpen(false)}
                                    className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                                  >
                                    View Full Cart
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-8">
                                <ShoppingCart className="w-10 h-10 mx-auto text-gray-300" />
                                <p className="mt-2 text-gray-500 text-sm">Your cart is empty</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* User Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setCartOpen(false); }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">
                      {getDisplayName()}
                      {profile?.role === 'admin' && <span className="ml-1 text-xs text-green-600">(Admin)</span>}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        {/* Show current user info */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as:</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                          <p className="text-xs text-gray-500">Role: {profile?.role || 'Loading...'}</p>
                        </div>

                        {profile?.role === 'admin' && (
                          <button
                            onClick={handleAdminAccess}
                            disabled={loading}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-green-600" /> 
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                        
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" /> <span>Profile Settings</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                        >
                          <User className="w-4 h-4 rotate-180" /> <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && !loading && (
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
            )}

            {loading && (
              <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                Loading...
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50 focus:outline-none transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === item.href ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {user && !loading && (
            <>
              <div className="px-3 py-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">Signed in as:</p>
                <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">Role: {profile?.role || 'Loading...'}</p>
              </div>

              {profile?.role !== "admin" && (
                <>
                  <Link
                    href="/order-history"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  >
                    Cart ({cartItemCount})
                  </Link>
                </>
              )}
              
              {profile?.role === 'admin' && (
                <button
                  onClick={() => { 
                    setIsOpen(false); 
                    handleAdminAccess(); 
                  }}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-700 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}
              
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
              >
                Profile Settings
              </Link>
              
              <button
                onClick={() => { 
                  setIsOpen(false); 
                  handleLogout(); 
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}
          
          {!user && !loading && (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}