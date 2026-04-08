import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Lazily create the NextAuth handler to avoid PrismaClient construction at build time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _handler: any;

function getHandler() {
  if (!_handler) {
    _handler = NextAuth(getAuthOptions());
  }
  return _handler;
}

export async function GET(...args: any[]) {
  return getHandler()(...args);
}

export async function POST(...args: any[]) {
  return getHandler()(...args);
}
