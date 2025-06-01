import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB, db } from "./config/db";

await connectDB();

if (!db) throw new Error("Database connection not established");

export const auth = betterAuth({
    database: mongodbAdapter(db.db!),
    emailAndPassword: {
        enabled: true,
    },
});

