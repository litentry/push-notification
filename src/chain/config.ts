import * as admin from "firebase-admin";
import { Event } from "@polkadot/types/interfaces";

export type InterestedEvent = { pattern: string, getPushData: (event: Event) => admin.messaging.TopicMessage };

const kusamaNetwork = {
  ws: "wss://kusama.api.onfinality.io/public-ws",
  events: [] as InterestedEvent []
} as const;

const polkadotNetwork = {
  ws: "wss://rpc.polkadot.io",
  events: [] as InterestedEvent[]
} as const;

const litentryNetwork = {
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
  }] as InterestedEvent[]
} as const;

export type ChainConfig = typeof kusamaNetwork | typeof polkadotNetwork | typeof litentryNetwork;

export default {
  kusama: kusamaNetwork,
  polkadot: polkadotNetwork,
  litentry_test: litentryNetwork
};

