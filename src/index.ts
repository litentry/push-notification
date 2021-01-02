import chalk from 'chalk';
import cluster from 'cluster';
import express from 'express';
import bodyParser from 'body-parser';
import { RequestContext } from '@mikro-orm/core';

import logger from './logger';
import MyRouter from './router';
import { DBHandler } from './db';

if (cluster.isMaster) {
  logger.debug(chalk.green(`Master process ${process.pid} is running ...`));
  // Fork workers
  let webServerWorker = cluster.fork({ type: 'web_server_process' });

  cluster.on('exit', (worker, code, signal) => {
    if (signal) {
      logger.warn(chalk.yellow(`Worker was killed by signal: ${signal}`));
    } else if (code != 0) {
      logger.warn(chalk.yellow(`Worker exited with error code: ${code}`));
    }

    if (worker.id == webServerWorker.id) {
      logger.info(chalk.green('Restarting webServer worker ...'));
      webServerWorker = cluster.fork({ type: 'web_server_process' });
    } else {
      logger.info(chalk.red(`Invalid worker ${worker.id} received`));
    }
  });
  // @ts-ignore
} else if (cluster.worker.process.env.type == 'web_server_process') {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use((req, res, next) => RequestContext.create(DBHandler.orm.em, next));

  app.use('/', MyRouter);

  /* Listen on port */
  const config = { port: 3000 };
  app.listen(config.port);
  /* Log some basic information */
  logger.info(chalk.green(`Process ${process.pid} is listening on: ${config.port}`));
  logger.info(chalk.green(`NODE_ENV: ${process.env.NODE_ENV}`));
} else {
  // @ts-ignore
  throw new Error(`Unknown worker type ${cluster.worker.process.env.type}`);
}

// // admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount)
// // });

// // const topicName = 'industry-tech';

// // var message = {
// //     notification: {
// //         title: '`$FooCorp` up 1.43% on the day',
// //         body: 'FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
// //     },
// //     // android: {
// //     //     notification: {
// //     //         icon: 'stock_ticker_update',
// //     //         color: '#7e55c3'
// //     //     }
// //     // },
// //     topic: topicName,
// // };

// // admin.messaging().send(message)
// //     .then((response) => {
// //         // Response is a message ID string.
// //         console.log('Successfully sent message:', response);
// //     })
// //     .catch((error) => {
// //         console.log('Error sending message:', error);
// //     });

// const mq = require('mq');
// const _ = require('lodash');

// // const redis = require("redis");
// // const client = redis.createClient();

// // mq.A();
// // client.on("error", function(error) {
// //   console.error(error);
// // });

// // client.set("key", "value", redis.print);
// // client.get("key", redis.print);

// // const admin = require("firebase-admin");
// // const serviceAccount = require("./push-notification-account.json");

// // admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount)
// // });

// // const deviceToken = 'fXvKVFu6RraIvDqYtTc2-a:APA91bGlo_OMgGHcNPt00vVb5Ndkb2N7_zWMpVT7Q0cTqRZ_cX23CB7Mi_Y0Vyloh3z22w-iVtTJZnLiWdavvY41xJWUlWxXo9ZclK3u_jq9Gf7iE2gl4qzVAllAJDHstG1_Bc3P7E_X';

// // const message = {
// //     data: {
// //         score: '850',
// //         time: '2:45'
// //     },
// //     notification: {
// //         title: '$FooCorp up 1.43% on the day',
// //         body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
// //     },
// //     token: deviceToken
// // };

// // admin.messaging().send(message)
// //     .then((response) => {
// //         // Response is a message ID string.
// //         console.log('Successfully sent message:', response);
// //     })
// //     .catch((error) => {
// //         console.log('Error sending message:', error);
// //     });
