import { EntityManager,
         EntityRepository,
         MikroORM,
         UnderscoreNamingStrategy,
         ConnectionOptions } from '@mikro-orm/core';

import * as E from './entities';
import logger from '../logger';

const config = {
  debug: true,
  host: 'localhost',
  port: 27017,
  user: undefined,
  password: undefined,
}

/**
 * @description Database handler
 * @property {MikroORM} orm
 * @property {EntityManager} em
 * @property {EntityRepository<Account>} accountRepository
 */
export const DBHandler = {} as {
  orm: MikroORM;
  em: EntityManager;
  Account: EntityRepository<E.Account>;
  createQueryBuilder: any;
};
export * from './entities';

(async () => {
  DBHandler.orm = await MikroORM.init({
    dbName: 'PushNotification',
    namingStrategy: UnderscoreNamingStrategy,
    baseDir: process.cwd(),
    entities: [`./dist/db/entities/*.js`],
    entitiesTs: [`./src/db/entities/*.ts`],
    forceUtcTimezone: true,
    logger: (message: string) => logger.info(message),
    type: 'mongo',
    ...config,
  });
  DBHandler.em = DBHandler.orm.em;

  DBHandler.Account = DBHandler.orm.em.getRepository(E['Account']);
  // @ts-ignore
  DBHandler.connection = DBHandler.orm.em.getConnection();
})();
