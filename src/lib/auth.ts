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
                if (!credentials) return null;

                const user = await authenticateUser(credentials.email, credentials.password);
                if (!user) return null;

                // ✅ Return minimal safe user object for JWT
                return {
                    id: user.id,
                    name: user.name ?? undefined,
                    email: user.email,
                    roleId: String(user.roleId),
                    roleTitle: user.roleTitle,
                    permissions: user.permissions,
                };
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
                session.user.permissions = token.permissions;
            }
            return session;
        },
    },
};

