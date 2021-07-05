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
  }, {
    pattern: "tips.newTip",
    getPushData() {
      return {
        topic: "tips.newTip",
        data: { deeplink: "litentry://tips" },
        notification: {
          title: "Tip Suggestion",
          body: "A new tip has been suggested, check it out!"
        }
      };
    }
  }, {
    pattern: "democracy.Started",
    getPushData() {
      return {
        topic: "democracy.Started",
        data: { deeplink: "litentry://referenda" },
        notification: {
          title: "Time to vote!",
          body: "A New Referendum has begun, check out the proposal!"
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

