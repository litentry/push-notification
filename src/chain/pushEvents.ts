import { Event } from '@polkadot/types/interfaces';
import * as admin from 'firebase-admin';

export type PushEvent = { pattern: string; getPushData: (event: Event) => admin.messaging.TopicMessage };

const networkKey = process.env.CHAIN_NETWORK;

const newTipEvent: PushEvent = {
  pattern: 'tips.NewTip',
  getPushData() {
    return {
      topic: 'tips.NewTip',
      data: { deeplink: `litentry://api/${networkKey}/tips` },
      notification: {
        title: 'Tip Suggestion',
        body: 'A new tip has been suggested, check it out!',
      },
    };
  },
};

const treasuryProposedEvent: PushEvent = {
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

const democracyStartedEvent: PushEvent = {
  pattern: 'democracy.Started',
  getPushData() {
    return {
      topic: 'democracy.Started',
      data: { deeplink: `litentry://api/${networkKey}/referenda` },
      notification: {
        title: 'Time to vote!',
        body: 'A New Referendum has begun, check out the proposal!',
      },
    };
  },
};

export const pushEvents: PushEvent[] = [treasuryProposedEvent, newTipEvent, democracyStartedEvent];
