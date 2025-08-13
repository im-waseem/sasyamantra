"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "user" }, // default role
      },
    });

    setLoading(false);

    if (error) return alert(error.message);
    alert("Registration successful! Please check your email to confirm.");
    router.push("/login");
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-3 w-full max-w-md mx-auto mt-10">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
