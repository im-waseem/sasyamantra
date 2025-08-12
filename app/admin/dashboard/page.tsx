"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.from("profiles").select("*");

        if (error) throw error;

        setUsers(data || []);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4">Total users: {users.length}</p>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Full Name</th>
            <th className="border px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email, full_name, created_at }) => (
            <tr key={id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{id}</td>
              <td className="border px-4 py-2">{email || "N/A"}</td>
              <td className="border px-4 py-2">{full_name || "N/A"}</td>
              <td className="border px-4 py-2">
                {created_at ? new Date(created_at).toLocaleString() : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
