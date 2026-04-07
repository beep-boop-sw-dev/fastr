import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Lazily build authOptions so PrismaClient is not constructed at build time.
let _authOptions: NextAuthOptions | undefined;

export function getAuthOptions(): NextAuthOptions {
  if (!_authOptions) {
    _authOptions = {
      adapter: PrismaAdapter(prisma()) as NextAuthOptions["adapter"],
      session: {
        strategy: "jwt",
      },
      pages: {
        signIn: "/sign-in",
        newUser: "/dashboard",
      },
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
          name: "credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Email and password are required");
            }

            const user = await prisma().user.findUnique({
              where: { email: credentials.email },
            });

            if (!user || !user.password) {
              throw new Error("Invalid email or password");
            }

            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
              throw new Error("Invalid email or password");
            }

            return { id: user.id, email: user.email, name: user.name, image: user.image };
          },
        }),
      ],
      callbacks: {
        async session({ token, session }) {
          if (token && session.user) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.picture;
          }
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
          } else if (!token.id) {
            const dbUser = await prisma().user.findUnique({
              where: { email: token.email! },
            });
            if (dbUser) {
              token.id = dbUser.id;
            }
          }
          return token;
        },
      },
    };
  }
  return _authOptions;
}
