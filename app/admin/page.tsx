"use client";

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
  const [search, setSearch] = useState("");

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from<User>("profiles")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by email
  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-6 text-gray-700">Total users: {users.length}</p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-2 border rounded w-full md:w-1/3"
        />

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">Email</th>
                  <th className="border border-gray-300 p-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(({ id, email, created_at }) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
