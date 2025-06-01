"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = () => {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (session) {
    redirect("/");
  }

  const [data, setData] = useState({
    name: "",
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
      const res = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/",
      });
      if (res.error) {
        setError(res.error.message || "Something went wrong");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return !isPending ? (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form
        className="flex flex-col gap-4 w-full max-w-[400px] px-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          className="border-2 border-gray-300 rounded-md p-2"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          disabled={loading}
          required
        />
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
          className="bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <Link href="/sign-in" className="text-blue-500 underline">
        Already have an account? Sign in
      </Link>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default Page;
