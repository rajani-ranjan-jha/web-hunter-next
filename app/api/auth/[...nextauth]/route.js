import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import { AuthOptions, AuthOptions2 } from "@/app/utils/auth";

const handler = NextAuth(AuthOptions2);

export { handler as GET, handler as POST, handler };
