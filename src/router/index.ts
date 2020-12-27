import { Router, Request, Response } from 'express';
import logger from 'src/logger';
import { pgClient } from 'src/db';

const app: Router = Router();

app.get('/', async (req: Request, res: Response) => {
  await pgClient.connect();
  await pgClient.disconnect();
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
    // TODO: insert into database
    logger.debug(`device token is: ${deviceToken}, address is: ${address}, ${address}`);

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
    // TODO: remove from database
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
