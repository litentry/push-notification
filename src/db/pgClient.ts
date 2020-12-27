import { Client } from 'pg';

import logger from 'src/logger';
import DBClient from 'src/db/base';
import { config, DBConfig } from 'src/config';

class PGClient extends DBClient {
  private config: DBConfig;
  private client: Client;

  constructor(config: DBConfig) {
    super();
    this.config = config;
    this.client = new Client();
  }

  async connect() {
    logger.debug('Connect to postgre server');
    await this.client.connect();
  }

  async disconnect() {
    logger.debug('Disconnect from postgre server');
    await this.client.end();
  }

  async insert() {}

}

export const pgClient = new PGClient(config.db);
