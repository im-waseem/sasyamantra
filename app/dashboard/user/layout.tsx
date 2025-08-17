import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="user">
      <div className="flex">
        <aside className="w-64 bg-gray-100 p-4">
          <ul>
            <li><a href="/dashboard/user" className="block p-2 hover:bg-gray-200">Home</a></li>
            <li><a href="/products" className="block p-2 hover:bg-gray-200">Products</a></li>
            <li><a href="/cart" className="block p-2 hover:bg-gray-200">Cart</a></li>
            <li><a href="/feedback" className="block p-2 hover:bg-gray-200">Feedback</a></li>
          </ul>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
