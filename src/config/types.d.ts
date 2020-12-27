export interface BaseConfig {}

export interface DBConfig extends BaseConfig {
  host: string;
  port: number;
  database: string;
}

export interface ChainConfig extends BaseConfig {
  protocol: string;
  host: string;
  port: number;
}

// export interface AccountConfig extends BaseConfig {
//   privateKey?: string;
//   mnemonic?: string;
//   default?: string;
// }
