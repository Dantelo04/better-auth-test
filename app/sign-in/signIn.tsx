"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import React, { useState } from "react";

export const SignIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form
        className="flex flex-col gap-4 w-full max-w-[400px] px-4"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 rounded-md p-2"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-gray-300 rounded-md p-2"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <Link href="/sign-up" className="text-blue-500 underline">
        Don't have an account? Sign up
      </Link>
    </div>
  );
};
