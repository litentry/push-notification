import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import logger from '../logger';
import * as subscriptionsRepository from '../repository/subscriptionsRepository';
import * as walletAddressesRepository from '../repository/walletAddressesRepository';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @description creates a subscription for a deviceToken adding the provided wallet address
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} walletAddress - the walletAddress of a user
 */
router.post('/', body('deviceToken').notEmpty(), body('walletAddress').notEmpty(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { deviceToken, walletAddress } = req.body;

  let subscription = await subscriptionsRepository.findOneByDeviceToken(deviceToken);

  if (!subscription) {
    subscription = await subscriptionsRepository.add(deviceToken, walletAddress);
  }

  if (!subscription.walletAddresses.find((wallet) => wallet.address === walletAddress)) {
    subscription = await subscriptionsRepository.addWalletAddress(deviceToken, walletAddress);
  }

  res.status(201).json(subscription);
});

/**
 * @description removes a walletAddress from a subscription
 */
router.delete('/:deviceToken/wallet-addresses/:walletAddress', async (req, res) => {
  const { deviceToken, walletAddress } = req.params;

  const subscription = await subscriptionsRepository.findOneByDeviceToken(deviceToken);

  if (!subscription) {
    return res
      .status(404)
      .json({ errors: [{ msn: `There is no walletAddress associated with deviceToken ${deviceToken}.` }] });
  }

  const wallet = await prisma.walletAddress.findFirst({
    where: {
      address: walletAddress,
      subscriptionId: subscription.id,
    },
  });

  if (!wallet) {
    return res.status(404).json({ errors: [{ msn: 'WalletAddress not found.' }] });
  }

  if (subscription.walletAddresses.length > 1) {
    await walletAddressesRepository.remove(walletAddress);

    return res.status(204).json(null);
  }

  const deleteWalletAddresses = prisma.walletAddress.deleteMany({
    where: {
      subscriptionId: Number(2),
    },
  });

  const deleteSubscription = prisma.subscription.delete({
    where: {
      id: Number(2),
    },
    include: {
      walletAddresses: true,
    },
  });

  try {
    await prisma.$transaction([deleteWalletAddresses, deleteSubscription]);

    res.status(204).json(null);
  } catch (e) {
    logger.error(e);
    res.status(500).json('There was an error!');
  }
});

export default router;
