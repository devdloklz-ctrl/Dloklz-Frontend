"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-8 shadow-lg bg-surface rounded-xl w-96">
        <h1 className="mb-6 text-2xl font-brand">Admin Panel</h1>

        <input
          className="w-full p-2 mb-3 border rounded border-border"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 border rounded border-border"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => login(identifier, password)}
          className="w-full py-2 rounded bg-brand-primary text-text-inverse hover:bg-hover"
        >
          Login
        </button>
      </div>
    </div>
  );
}
