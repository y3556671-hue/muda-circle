import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";
import { verifyCodeSchema } from "@/lib/validators/auth";
import { verifyLoginCode } from "@/lib/services/auth-service";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "email-code",
      name: "邮箱验证码登录",
      credentials: {
        email: { label: "邮箱", type: "email" },
        code: { label: "验证码", type: "text" },
      },
      async authorize(credentials) {
        const parsed = verifyCodeSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "登录信息无效");
        }

        return verifyLoginCode(parsed.data.email, parsed.data.code);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username ?? null;
        token.avatarColor = user.avatarColor;
        token.needsProfileCompletion = !user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string | null) ?? null;
        session.user.avatarColor = (token.avatarColor as string) ?? "#CC8800";
        session.user.needsProfileCompletion = Boolean(token.needsProfileCompletion);
      }

      return session;
    },
  },
  secret: getEnv("NEXTAUTH_SECRET"),
};

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
