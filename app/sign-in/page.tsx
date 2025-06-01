"use client";

import { authClient } from "@/lib/auth-client";
import { SignIn } from "./signIn";
import { redirect } from "next/navigation";

const Page = () => {
    const { data: session, isPending, error, refetch } = authClient.useSession();
    
    if (session) {
        redirect("/");
    } else {
        console.log(error?.message);
    }
    
    return !isPending ? (
        <SignIn />
    ) : (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
};

export default Page;

