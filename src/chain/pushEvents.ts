import { Event } from '@polkadot/types/interfaces';
import * as admin from 'firebase-admin';

export type PushEvent = { pattern: string; getPushData: (event: Event) => admin.messaging.TopicMessage };

export const getPushEvents = ({ networkKey }: { networkKey: string }) => {
  return [treasuryProposedEvent(networkKey), tipsNewTipEvent(networkKey)];
};

function tipsNewTipEvent(networkKey: string) {
  return {
    pattern: 'tips.newTip',
    getPushData() {
      return {
        topic: 'tips.newTip',
        data: { deeplink: `litentry://api/${networkKey}/tips` },
        notification: {
          title: 'Tip Suggestion',
          body: 'A new tip has been suggested, check it out!',
        },
      };
    },
  };
}

function treasuryProposedEvent(networkKey: string) {
  return {
    pattern: 'treasury.Proposed',
    getPushData() {
      return {
        topic: 'treasury.Proposed',
        data: { deeplink: `litentry://api/${networkKey}/treasury` },
        notification: {
          title: `New Treasury Proposal`,
          body: 'A new treasury proposal has been submitted, check it out!',
        },
      };
    },
  };
}
