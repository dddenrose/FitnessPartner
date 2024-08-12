import { PrismaClient } from "@prisma/client";

// 根據環境變數來決定是否初始化 Prisma 客戶端
const prismaClientSingleton = () => {
  return process.env.NEXT_PUBLIC_USE_PRISMA === "true"
    ? new PrismaClient()
    : null;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 只在 NEXT_PUBLIC_USE_PRISMA 環境變數設置為 true 的情況下初始化 Prisma
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production" && prisma)
  globalThis.prismaGlobal = prisma;
