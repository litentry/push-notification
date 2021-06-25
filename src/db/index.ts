import { EntityManager, EntityRepository, MikroORM, UnderscoreNamingStrategy } from '@mikro-orm/core';

import * as E from './entities';
import logger from '../logger';
// import config from '../config';

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
  connection: any;
};
export * from './entities';

(async () => {
  DBHandler.orm = await MikroORM.init({
    namingStrategy: UnderscoreNamingStrategy,
    baseDir: process.cwd(),
    entities: [`./dist/db/entities/*.js`],
    entitiesTs: [`./src/db/entities/*.ts`],
    forceUtcTimezone: true,
    logger: (message: string) => logger.info(message),
    // ...config.db,
  });

  DBHandler.em = DBHandler.orm.em;
  DBHandler.connection = DBHandler.orm.em.getConnection();

  DBHandler.Account = DBHandler.orm.em.getRepository(E['Account']);
})();
