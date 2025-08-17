import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="admin">
      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white p-4">
          <ul>
            <li><a href="/dashboard/admin" className="block p-2 hover:bg-gray-700">Admin Home</a></li>
            <li><a href="/dashboard/admin/users" className="block p-2 hover:bg-gray-700">Manage Users</a></li>
            <li><a href="/dashboard/admin/products" className="block p-2 hover:bg-gray-700">Manage Products</a></li>
          </ul>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
