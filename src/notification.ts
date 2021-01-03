import * as admin from 'firebase-admin';
// import { Message } from 'firebase-admin/messaging';
import logger from './logger';

const serviceAccount = require('../push-notification-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const deviceToken = 'cL4eLe3iScCzavTgel7wAi:APA91bEjVOwega8fdH6-bDk9LcuTPuVG_4rHgkvqxHD5XGq9sop0pQuxkT5V3MdXawgvQjq1-i-mJJnyrkT9FtBaOA17HZb879b8lySZYqRvMQ9fOWxGV4QoEbS4H0C87aF6vJwHgZfl';

// const message = {
//   data: {
//     score: '850',
//     time: '2:45',
//   },
//   notification: {
//     title: '$FooCorp up 1.43% on the day',
//     body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.',
//   },
//   // token: deviceToken,
//   topic: 'weather',
// };

// interface Message {
//   notification: object;
//   data: object;
// }

// export interface TopicMessage extends Message {
//   topic: string;
// }

// export interface TokenMessage extends Message {
//   token: string;
// }
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
