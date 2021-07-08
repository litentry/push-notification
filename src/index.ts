import chalk from 'chalk';
import cluster from 'cluster';
import express from 'express';

import logger from './logger';
import chain from './chain';
import Api from './api';

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
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api', Api);

  /* Listen on port */
  const httpPort = process.env.HTTP_PORT || 8080;
  app.listen(httpPort);
  /* Log some basic information */
  logger.info(chalk.green(`Process ${process.pid} is listening on: ${httpPort}`));
  logger.info(chalk.green(`NODE_ENV: ${process.env.NODE_ENV}`));

  (async () => {
    await chain.eventListenerAutoRestart().catch(console.error);
  })();
} else {
  // @ts-ignore
  throw new Error(`Unknown worker type ${cluster.worker.process.env.type}`);
}
