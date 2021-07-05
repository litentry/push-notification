import * as admin from "firebase-admin";
import { Event } from "@polkadot/types/interfaces";

export type InterestedEvent = { pattern: string, getPushData: (event: Event) => admin.messaging.TopicMessage };

export type ChainConfig = {
  ws: string;
  events: readonly InterestedEvent[]
}

const kusamaNetwork: ChainConfig = {
  ws: "wss://kusama.api.onfinality.io/public-ws",
  events: [],
} as const

const polkadotNetwork: ChainConfig = {
  ws: "wss://rpc.polkadot.io",
  events: [],
} as const

const litentryNetwork: ChainConfig = {
  // ws: 'wss://3.0.201.137',
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


export default {
  kusama: kusamaNetwork,
  polkadot: polkadotNetwork,
  litentry_test: litentryNetwork
};

