import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  email: string | null;
  created_at: string | null;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.from("profiles").select("id, email, created_at");
      if (error) {
        setError(error.message);
        setUsers([]);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-500">Loading users, please wait...</p>;

  if (error)
    return (
      <p className="p-4 text-red-600 font-semibold">
        Error loading users: {error}
      </p>
    );

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4 text-gray-700">Total users: {users.length}</p>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Email</th>
              <th className="border border-gray-300 p-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, email, created_at }) => (
              <tr
                key={id}
                className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <td className="border border-gray-300 p-3">{email || "N/A"}</td>
                <td className="border border-gray-300 p-3">
                  {created_at
                    ? new Date(created_at).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
