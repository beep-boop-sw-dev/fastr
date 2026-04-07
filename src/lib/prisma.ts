import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Returns a lazily-initialized, singleton PrismaClient.
 * Call this function wherever you need the client instead of
 * importing a module-level instance (which would crash at build
 * time when DATABASE_URL is unavailable).
 */
export function prisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
