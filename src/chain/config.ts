import { pushEvents, PushEvent } from './pushEvents';

export type ChainConfig = {
  ws: string;
  pushEvents: PushEvent[];
};

const kusamaNetwork: ChainConfig = {
  ws: 'wss://kusama.api.onfinality.io/public-ws',
  pushEvents,
} as const;

const polkadotNetwork: ChainConfig = {
  ws: 'wss://rpc.polkadot.io',
  pushEvents,
} as const;

const litentryNetwork: ChainConfig = {
  // ws: 'wss://3.0.201.137',
  ws: 'wss://staging.registrar.litentry.io',
  pushEvents,
};

export default {
  kusama: kusamaNetwork,
  polkadot: polkadotNetwork,
  litentry_test: litentryNetwork,
};
