import { getPushEvents, PushEvent } from 'chain/pushEvents';

export type ChainConfig = {
  ws: string;
  pushEvents: PushEvent[];
};

const kusamaNetwork: ChainConfig = {
  ws: 'wss://kusama.api.onfinality.io/public-ws',
  pushEvents: getPushEvents({ networkKey: 'kusama' }),
} as const;

const polkadotNetwork: ChainConfig = {
  ws: 'wss://rpc.polkadot.io',
  pushEvents: getPushEvents({ networkKey: 'polkadot' }),
} as const;

const litentryNetwork: ChainConfig = {
  // ws: 'wss://3.0.201.137',
<<<<<<< HEAD
  ws: "wss://staging.registrar.litentry.io",
  events: [{
    pattern: "treasury.Proposed",
    getPushData() {
      return {
        topic: "treasury.Proposed",
        data: { deeplink: "litentry://api/litentry_test/treasury" },
        notification: {
          title: `New Treasury Proposal`,
          body: "A new treasury proposal has been submitted, check it out!"
        }
      };
    }
  }]
}

=======
  ws: 'wss://staging.registrar.litentry.io',
  pushEvents: getPushEvents({ networkKey: 'litentry_test' }),
};
>>>>>>> 188e76c (Move push events to their own file and address PR issue)

export default {
  kusama: kusamaNetwork,
  polkadot: polkadotNetwork,
  litentry_test: litentryNetwork,
};
