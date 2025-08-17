// app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the Sasya Mantra admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
          <p className="text-3xl font-bold text-blue-600">89</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
          <p className="text-3xl font-bold text-orange-600">456</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">₹78,900</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <p className="text-gray-600">Recent orders will be displayed here...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
              Add New Product
            </button>
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
              View All Orders
            </button>
            <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}