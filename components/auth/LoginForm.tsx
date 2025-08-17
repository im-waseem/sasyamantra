 "use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) return alert(error.message);
    alert("Login successful!");
    router.push("/"); // redirect after login
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full max-w-md mx-auto mt-10">
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
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
