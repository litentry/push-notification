import { Options } from '@mikro-orm/core';
// import config from '../config';

const options: Options = {
  entities: [`./dist/db/entities/*.js`],
  entitiesTs: [`./src/db/entities/*.ts`],
  baseDir: process.cwd(),
  // ...config.db,
};

export default options;
