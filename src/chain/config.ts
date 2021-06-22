const kusamaNetwork = {
  ws: 'wss://kusama.api.onfinality.io/public-ws',
  events: ['*'],
} as const;

const polkadotNetwork = {
  ws: 'wss://rpc.polkadot.io',
  events: ['*'],
} as const;

const litentryNetwork = {
  ws: 'wss://3.0.201.137',
  events: ['*'],
} as const;

export type ChainConfig = typeof kusamaNetwork | typeof polkadotNetwork | typeof litentryNetwork;

export default {
  kusama: kusamaNetwork,
  polkadot: polkadotNetwork,
  litentry_test: litentryNetwork,
};
