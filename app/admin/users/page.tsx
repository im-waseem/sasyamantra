"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, role, created_at, last_sign_in_at, email_confirmed_at");

        if (error) throw error;
        setUsers(data || []);
        setFilteredUsers(data || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setUsers([]);
        setFilteredUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 font-medium">Loading users...</p>
    );

  if (error)
    return (
      <p className="p-6 text-center text-red-600 font-semibold">
        Error loading users: {error}
      </p>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Users</h1>

      <input
        type="text"
        placeholder="Search by email..."
        className="mb-6 w-full max-w-md mx-auto block p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Email</th>
              <th className="border border-gray-300 p-3 text-left">Role</th>
              <th className="border border-gray-300 p-3 text-left">Created At</th>
              <th className="border border-gray-300 p-3 text-left">Last Sign In</th>
              <th className="border border-gray-300 p-3 text-left">Email Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500 font-medium">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                >
                  <td className="border border-gray-300 p-3 break-all">{user.email}</td>
                  <td className="border border-gray-300 p-3 capitalize">{user.role}</td>
                  <td className="border border-gray-300 p-3">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {user.email_confirmed_at ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
