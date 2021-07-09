import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import logger from '../logger';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  return res.json({ msg: 'The API is working' });
});

/**
 * @description creates a subscription for a deviceToken adding the provided wallet address
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} walletAddress - the walletAddress of a user
 */
router.post('/subscriptions', body('deviceToken').notEmpty(), body('walletAddress').notEmpty(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { deviceToken, walletAddress } = req.body;

  let subscription = await prisma.subscription.findUnique({
    where: {
      deviceToken: deviceToken,
    },
    include: {
      walletAddresses: true,
    },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
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

  if (!subscription.walletAddresses.some((wallet) => wallet.address === walletAddress)) {
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id,
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
    subscription = updatedSubscription;
  }

  res.status(201).json(subscription);
});

/**
 * @description deletes a subscription
 */
router.delete('/subscriptions/:id', async (req, res) => {
  const { id } = req.params;

  const subscription = await prisma.subscription.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!subscription) {
    return res.status(404).json(`Subscription with id "${id}" not found.`);
  }

  const deleteWalletAddresses = prisma.walletAddress.deleteMany({
    where: {
      subscriptionId: Number(id),
    },
  });

  const deleteSubscription = prisma.subscription.delete({
    where: {
      id: Number(id),
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
