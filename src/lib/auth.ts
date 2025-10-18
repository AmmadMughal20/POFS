// server/authOptions.ts
import { authenticateUser } from "@/server/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthOptions, SessionStrategy } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";


declare module "next-auth" {
    interface Session
    {
        user: {
            id: string;
            email: string;
        } & DefaultSession["user"];
    }

    interface User
    {
        id: string;
        email: string;
    }

    interface JWT
    {
        id?: string;
        email?: string;
    }
}


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "john@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials)
            {
                if (!credentials) return null;

                const user = await authenticateUser(credentials.email, credentials.password);
                return user ?? null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
};

