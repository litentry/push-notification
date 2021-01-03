import _ from 'lodash';
import { Router, Request, Response } from 'express';
import { wrap } from '@mikro-orm/core';

import logger from '../logger';
import { DBHandler, Account } from '../db';

const app: Router = Router();

app.get('/', async (req: Request, res: Response) => {
  return res.json({ msg: 'Hello world' });
});

/**
 * @description A user register from our APP
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} walletAddress - the walletAddress of a user
 */
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { deviceToken, walletAddress } = req.body;
    logger.debug(`device token is: ${deviceToken}, walletAddress is: ${walletAddress}, ${walletAddress}`);
    if (_.isEmpty(deviceToken) || _.isEmpty(walletAddress)) {
      throw new Error(`deviceToken or walletAddress is missing`);
    }
    let account = await DBHandler.Account.findOne({ deviceToken: deviceToken, walletAddress: walletAddress });
    if (!account) {
      account = new Account(deviceToken, walletAddress, []);
      await DBHandler.Account.persist(account).flush();
    }

    return res.json({ status: 'success', msg: '', account: account });
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
 * @param {string} walletAddress - the walletAddress of a user
 */
app.post('/deregister', async (req: Request, res: Response) => {
  try {
    const { deviceToken, walletAddress } = req.body;
    logger.debug(`device token is: ${deviceToken}, walletAddress is: ${walletAddress}`);
    if (_.isEmpty(deviceToken) || _.isEmpty(walletAddress)) {
      throw new Error(`deviceToken or walletAddress is missing`);
    }

    const account = (await DBHandler.Account.findOne({
      deviceToken: deviceToken,
      walletAddress: walletAddress,
    })) as Account;
    await DBHandler.Account.removeAndFlush(account);
    res.status(204);
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
 * @param {string} walletAddress - the wallet walletAddress of a user
 * @param {string[]} events - a list of events a user interest.
 */
app.post('/events/config', async (req: Request, res: Response) => {
  try {
    const { deviceToken, walletAddress, events = [] } = req.body;
    if (_.isEmpty(events)) {
      return res.json({ status: 'success', msg: 'No events provided' });
    }

    let account = (await DBHandler.Account.findOne({
      deviceToken: deviceToken,
      walletAddress: walletAddress,
    })) as Account;
    wrap(account).assign({ events: events });
    await DBHandler.Account.persist(account).flush();

    return res.json({ status: 'success', msg: '', account: account });
  } catch (error) {
    logger.error(`POST /events/config: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

/**
 * @description Update a list of events subscribed by a user
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} walletAddress - the wallet walletAddress of a user
 * @param {string[]} events - a list of events a user is interested.
 */
app.patch('/events/config', async (req: Request, res: Response) => {
  try {
    const { deviceToken, walletAddress, events = [] } = req.body;
    if (_.isEmpty(events)) {
      return res.json({ status: 'success', msg: 'No events provided' });
    }

    let account = (await DBHandler.Account.findOne({
      deviceToken: deviceToken,
      walletAddress: walletAddress,
    })) as Account;
    // Update events
    let newEvents = new Set(account.events);

    for (let e of events) {
      if (!newEvents.has(e)) {
        newEvents.add(e);
      }
    }

    wrap(account).assign({ events: [...newEvents] });
    await DBHandler.Account.persist(account).flush();

    return res.json({ status: 'success', msg: '', account: account });
  } catch (error) {
    logger.error(`PATCH /events/config: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

/**
 * @description remove a list of events a user is not interested in.
 * @param {string} deviceToken - the device token of user's device (e.g. phone)
 * @param {string} walletAddress - the wallet walletAddress of a user
 * @param {string[]} events - a list of events a user interest.
 */
app.delete('/events/config', async (req: Request, res: Response) => {
  try {
    const { deviceToken, walletAddress, events = [] } = req.body;
    if (_.isEmpty(events)) {
      return res.json({ status: 'success', msg: 'No events provided' });
    }

    let account = (await DBHandler.Account.findOne({
      deviceToken: deviceToken,
      walletAddress: walletAddress,
    })) as Account;
    let newEvents = new Set(account.events);

    for (let e of events) {
      if (newEvents.has(e)) {
        newEvents.delete(e);
      }
    }

    wrap(account).assign({ events: [...newEvents] });
    await DBHandler.Account.persist(account).flush();

    return res.json({ status: 'success', msg: '', account: account });
  } catch (error) {
    logger.error(`DELETE /events/config: unexcepected error occurs`);
    console.trace(error);

    res.status(400);
    return res.json({ status: 'fail', msg: new String(error) });
  }
});

export default app;
