import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/prisma/client";

const prismaClientSingleton = () => {
  // Prefer the same non-pooled URL used by prisma.config.ts to avoid
  // transient PgBouncer disconnects during concurrent server renders.
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Missing PostgreSQL connection URL. Set POSTGRES_URL_NON_POOLING (preferred) or POSTGRES_PRISMA_URL/POSTGRES_URL.",
    );
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
