// components/AdminLayoutWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ProfileType {
  id: string;
  role: string;
  full_name?: string;
}

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("id, role, full_name")
            .eq("id", currentUser.id)
            .single();

          if (!error && profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // If it's an admin route
  if (pathname?.startsWith("/admin")) {
    // Show loading while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    // Redirect if not admin or not logged in
    if (!user || profile?.role !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this area.</p>
            <a 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }

    // Render admin layout for admin routes
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600 mt-1">Sasya Mantra</p>
            </div>
            <nav className="mt-6">
              <a 
                href="/admin" 
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/admin' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </a>
              <a 
                href="/admin/users" 
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/admin/users' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Users
              </a>
              <a 
                href="/admin/products" 
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/admin/products' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Products
              </a>
              <a 
                href="/admin/orders" 
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/admin/orders' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Orders
              </a>
              <a 
                href="/admin/settings" 
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/admin/settings' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Settings
              </a>
            </nav>
            
            {/* Admin user info and logout */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // For non-admin routes, just return children (LayoutWrapper will handle the regular layout)
  return <>{children}</>;
}