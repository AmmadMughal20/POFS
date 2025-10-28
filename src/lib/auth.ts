// server/authOptions.ts
import { authenticateUser } from "@/server/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthOptions, SessionStrategy } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";


declare module "next-auth" {
    interface User
    {
        id: string;
        name?: string;
        email: string;
        roleId?: string;
        roleTitle?: string;
        branchId?: string | null
        businessId?: string | null
        permissions?: string[];
    }
    interface Session
    {
        user: {
            id: string;
            name?: string;
            email: string;
            roleId?: string;
            roleTitle?: string;
            branchId?: string | null
            businessId?: string | null
            permissions?: string[];
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT
    {
        id: string;
        name?: string;
        email: string;
        roleId?: string;
        roleTitle?: string;
        branchId?: string | null
        businessId?: string | null
        permissions?: string[];
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
                if (!credentials) throw new Error("Missing credentials");
                try
                {

                    const user = await authenticateUser(credentials.email, credentials.password);
                    // ✅ Return minimal safe user object for JWT
                    return {
                        id: user.id,
                        name: user.name ?? undefined,
                        email: user.email,
                        roleId: String(user.roleId),
                        roleTitle: user.roleTitle,
                        permissions: user.permissions,
                        branchId: user.branchId,
                        businessId: user.businessId
                    };
                }
                catch (error)
                {
                    if (error instanceof Error)
                    {
                        throw new Error(error.message);
                    }
                    throw new Error("Login failed due to an unknown error");
                }
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
    callbacks: {
        async jwt({ token, user })
        {
            if (user)
            {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.roleId = user.roleId;
                token.roleTitle = user.roleTitle;
                token.permissions = user.permissions;
                token.branchId = user.branchId;
                token.businessId = user.businessId; // optional if admin
            }
            return token;
        },
        async session({ session, token })
        {
            if (token)
            {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.roleId = token.roleId;
                session.user.roleTitle = token.roleTitle;
                session.user.branchId = token.branchId;
                session.user.businessId = token.businessId;
                session.user.permissions = token.permissions;
            }
            return session;
        },
    },
};

