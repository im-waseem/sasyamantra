// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <a href="/admin" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Dashboard
            </a>
            <a href="/admin/users" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Users
            </a>
            <a href="/admin/products" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Products
            </a>
            <a href="/admin/orders" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Orders
            </a>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;