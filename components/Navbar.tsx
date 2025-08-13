// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Leaf, ShoppingCart, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/app/admin/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Feedback", href: "/feedback" },
  ];

  // Load user session from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        setRole(data.user.user_metadata?.role || "user");
      } else {
        setUser(null);
        setRole(null);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          setUser(session.user);
          setRole(session.user.user_metadata?.role || "user");
        } else {
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Completely hide navbar for admin dashboard
  if (role === "admin" && pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sasya Mantra</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}

            {user && role !== "admin" && (
              <Link
                href="/order-history"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
              >
                Track Orders
              </Link>
            )}

            {user && role !== "admin" && (
              <div className="relative">
                <button
                  onClick={() => setCartOpen(!cartOpen)}
                  className="flex items-center text-sm text-gray-800 hover:text-green-600"
                >
                  <ShoppingCart className="w-5 h-5 mr-1" />
                  {items?.length ?? 0}
                </button>

                {cartOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-3">
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-1 border-b last:border-b-0"
                        >
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} × ₹{item.price}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Your cart is empty.</p>
                    )}
                    <Link
                      href="/cart"
                      className="block mt-2 text-center bg-green-600 text-white py-1 rounded hover:bg-green-700"
                    >
                      View Cart
                    </Link>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-800 hover:text-green-600"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.email}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    {role !== "admin" && (
                      <Link
                        href="/order-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Track Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-green-600 font-medium hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-green-600 font-medium hover:underline"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-green-600 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t px-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-700 hover:text-green-600 px-3 py-2 text-base font-medium"
              >
                {item.name}
              </Link>
            ))}

            {user && role !== "admin" && (
              <>
                <Link
                  href="/order-history"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600"
                >
                  Track Orders
                </Link>
                <Link
                  href="/cart"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600"
                >
                  Cart ({items?.length ?? 0})
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-green-600 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-green-600 hover:underline"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

  // Optionally, you can export types or helper functions here if needed in the future.
  // Currently, all logic is encapsulated in the Navbar component above.