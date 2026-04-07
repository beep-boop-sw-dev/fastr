import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  _prisma: PrismaClient | undefined;
};

function getClient(): PrismaClient {
  if (!globalForPrisma._prisma) {
    globalForPrisma._prisma = new PrismaClient();
  }
  return globalForPrisma._prisma;
}

// Lazy proxy: defers PrismaClient instantiation until first use at runtime.
// This prevents build-time crashes when DATABASE_URL is not set.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const val = (client as never)[prop as keyof PrismaClient];
    if (typeof val === "function") {
      return (val as Function).bind(client);
    }
    return val;
  },
});
