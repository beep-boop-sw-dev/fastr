import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Wrap in a function so NextAuth + PrismaClient are not constructed at build time.
function handler() {
  return NextAuth(getAuthOptions());
}

export async function GET(req: Request) {
  return handler()(req as any);
}

export async function POST(req: Request) {
  return handler()(req as any);
}
