import * as admin from 'firebase-admin';
import logger from './logger';

const serviceAccount = require('../push-notification-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

export async function pushNotification(message: admin.messaging.Message) {
  try {
    const resp = await messaging.send(message);
    logger.debug(`Push notification to firebase successfully, resp: ${resp}`);
  } catch (error) {
    logger.error(`Unexpected error occurs during push notification, error: ${error}`);
  }
}

export default pushNotification;
