"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(identifier, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-8 shadow-lg bg-surface rounded-xl w-96">
        <h1 className="mb-6 text-2xl font-brand">Admin Panel</h1>

        <input
          className="w-full p-2 mb-3 border rounded border-border"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 border rounded border-border"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 py-2 rounded bg-brand-primary text-text-inverse hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg
              className="w-5 h-5 animate-spin text-text-inverse"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
