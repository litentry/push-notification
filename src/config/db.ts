export const dbType = 'sqlite';
// export const dbType = 'mysql';
// export const dbType = 'postgresql';
// export const dbType = 'mongo';

export const debug = true;
// @ts-ignore
export const dbName = dbType === 'sqlite' ? 'PushNotification.db' : 'PushNotification';

export const sqliteConfig = {
  dbName: dbName,
  debug: debug,
};

export const mongoConfig = {
  dbName: dbName,
  debug: debug,
  host: 'localhost',
  port: 27017,
  user: undefined,
  password: undefined,
};

export const mysqlConfig = {
  dbName: dbName,
  debug: debug,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
};

export const postgresqlConfig = {
  dbName: dbName,
  debug: debug,
  host: 'localhost',
  port: 5432,
  user: 'zxchen',
  password: 'postgresql',
};
