import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";
import { Prisma, PrismaClient } from "@/generated/prisma/client.js";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "info", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
