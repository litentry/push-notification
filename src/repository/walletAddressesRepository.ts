import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function remove(walletAddress: string) {
  return prisma.walletAddress.deleteMany({
    where: {
      address: walletAddress,
    },
  });
}
