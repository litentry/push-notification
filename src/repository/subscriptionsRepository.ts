import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function findOneByDeviceToken(deviceToken: string, includeWalletAddresses: boolean = false) {
  return prisma.subscription.findUnique({
    where: {
      deviceToken: deviceToken,
    },
    include: {
      walletAddresses: includeWalletAddresses,
    },
  });
}

export function add(deviceToken: string, walletAddress: string) {
  return prisma.subscription.create({
    data: {
      deviceToken,
      walletAddresses: {
        create: [{ address: walletAddress }],
      },
    },
    include: {
      walletAddresses: true,
    },
  });
}

export function addWalletAddress(deviceToken: string, walletAddress: string) {
  return prisma.subscription.update({
    where: {
      deviceToken,
    },
    data: {
      walletAddresses: {
        create: [{ address: walletAddress }],
      },
    },
    include: {
      walletAddresses: true,
    },
  });
}
