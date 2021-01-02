import { Router, Request, Response } from 'express';
import logger from '../logger';
import { DBHandler, Account } from '../db';
import { wrap } from '@mikro-orm/core';

const app: Router = Router();

app.get('/', async (req: Request, res: Response) => {
  return res.json({ msg: 'Hello world' });
});

/**
 * @description A user register from our APP
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} address - the wallet address of a user
 */
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { deviceToken, address } = req.body;
    logger.debug(`device token is: ${deviceToken}, address is: ${address}, ${address}`);
    let account = await DBHandler.Account.findOne({ deviceToken: deviceToken, walletAddress: address });
    if (! account) {
      account = new Account(deviceToken, address);
      await DBHandler.Account.persist(account).flush();
    }

    return res.json({ status: 'success', msg: '' });
  } catch (error) {
    logger.error(`POST /register: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

/**
 * @description A user de-register from our APP
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} address - the wallet address of a user
 */
app.post('/deregister', async (req: Request, res: Response) => {
  try {
    const { deviceToken, address } = req.body;
    logger.debug(`device token is: ${deviceToken}, address is: ${address}`);

    const account = await DBHandler.Account.findOne({ deviceToken: deviceToken, walletAddress: address });
    // @ts-ignore
    await DBHandler.Account.removeAndFlush(account);

    return res.json({ status: 'success', msg: '' });
  } catch (error) {
    logger.error(`POST /deregister: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

/**
 * @description Create a list of events subscribed by a user
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} address - the wallet address of a user
 * @param {string[]} events - a list of events a user interest.
 */
app.post('/events/config', async (req: Request, res: Response) => {
  try {
    const { deviceToken, address, events = [] } = req.body;
    return res.json({ status: 'success', msg: '' });
  } catch (error) {
    logger.error(`POST /deregister: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

/**
 * @description Update a list of events subscribed by a user
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} address - the wallet address of a user
 * @param {string[]} events - a list of events a user is interested.
 */
app.patch('/events/config', async (req: Request, res: Response) => {
  try {
    const { deviceToken, address, events = [] } = req.body;
    return res.json({ status: 'success', msg: '' });
  } catch (error) {
    logger.error(`PATCH /deregister: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

/**
 * @description remove a list of events a user is not interested in.
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} address - the wallet address of a user
 * @param {string[]} events - a list of events a user interest.
 */
app.delete('/events/config', async (req: Request, res: Response) => {
  try {
    const { deviceToken, address, events = [] } = req.body;
    return res.json({ status: 'success', msg: '' });
  } catch (error) {
    logger.error(`DELETE /deregister: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

export default app;
