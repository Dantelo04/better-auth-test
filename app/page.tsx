"use client";

import UsersList from "@/components/UsersList/UsersList";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {session && session.user ? (
        <div>
          <h1 className="text-xl p-2 border rounded">
            Welcome <strong>{session.user?.name}</strong>
          </h1>
        </div>
      ) : !isPending ? (
        <div>
          <p className="font-bold text-red-500">Not logged in</p>
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
      <h1 className="text-6xl font-bold">Better Auth Test</h1>
      <p className="text-lg">
        By{" "}
        <a
          target="_blank"
          href="https://dantelo.dev/"
          className="text-blue-500 underline"
        >
          Dantelo
        </a>
      </p>
      {session && session.user ? (
        <div className="flex flex-col gap-2">
          <Link href="/blog" className="text-blue-500 underline">
            Create Blog
          </Link>
          <button
            className="text-blue-500 underline cursor-pointer"
            onClick={async () =>
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in");
                  },
                },
              })
            }
          >
            Sign Out
          </button>
        </div>
      ) : !isPending ? (
        <>
          <Link href="/sign-in" className="text-blue-500 underline">
            Sign In
          </Link>
          <Link href="/sign-up" className="text-blue-500 underline">
            Sign Up
          </Link>
        </>
      ) : (
        <></>
      )}
      <UsersList />
    </div>
  );
}
