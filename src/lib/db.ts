import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/prisma/client";

const prismaClientSingleton = () => {
  // PostgreSQL adapter with pooled connection URL
  // Use the same env var as in prisma.config.ts for consistency
  const adapter = new PrismaPg({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
