import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { Vec } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/create/types.d';
import { EventRecord, Event, Phase } from '@polkadot/types/interfaces';

import logger from '../logger';
import pushNotification from '../notification';
import config, { ChainConfig } from './config';

/**
 * @name Chain
 * @description The blockchain class.
 */
class Chain {
  /**
   * @description WebSocket Provider from the chain.
   */
  private wsProvider: WsProvider;
  /**
   * @description keyring of user accounts
   */
  private keyring: Keyring;
  /**
   * @description API interfaces of `Chain`
   */
  private api: ApiPromise;

  private unsubscribeEventListener: null | Promise<() => void>;

  /**
   * @description interested events of this chain
   */
  private interestedEvents: ReadonlyArray<string>;

  /**
   * @description the flag to indicate first connecting attemp
   */
  private firstConnected: boolean;

  /**
   * @description constructor of Chain
   */
  constructor(config: ChainConfig) {
    this.wsProvider = new WsProvider(config.ws);
    this.interestedEvents = config.events;
    this.keyring = new Keyring({ type: 'sr25519' });
    this.unsubscribeEventListener = null;
    this.firstConnected = true;
  }

  /**
   * @description Connect to a configured block chain, such as `polkadot`, `kusama` or `localchain`.
   */
  async connect() {
    this.api = await ApiPromise.create({ provider: this.wsProvider });

    const [chain, nodeName, nodeVersion] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version(),
    ]);

    logger.info(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    return this.api;
  }

  /**
   * @description Start a event listener
   */
  async eventListenerStart() {
    if (this.unsubscribeEventListener) {
      logger.debug('[EventListenerStart] Event listener is running now...');

      return this.unsubscribeEventListener;
    }

    logger.debug('[EventListenerStart] Starting event listener...');

    await this.connect();

    this.unsubscribeEventListener = this.api.query.system.events((events: Vec<EventRecord>) => {
      // Loop through the Vec<EventRecord>
      events.forEach((record: EventRecord) => {
        // Extract the phase, event and the event types
        const event: Event = record.event;
        const phase: Phase = record.phase;
        logger.debug(`Received event from chain: [${event.section}.${event.method}]`);

        for (let interestedEvent of this.interestedEvents) {
          const [interestedSection, interestedMethod] = interestedEvent.split('.');

          if (interestedSection === '*') {
            logger.debug(`Process interestedSection: ${interestedSection}`);
            this.handleEvent(event);
            break;
          } else if (interestedSection === event.section && interestedMethod === '*') {
            logger.debug(`Process interestedSection: ${interestedSection}.${interestedMethod}`);
            this.handleEvent(event);
            break;
          } else if (interestedSection === event.section && interestedMethod === event.method) {
            logger.debug(`Process interestedSection: ${interestedSection}.${interestedMethod}`);
            this.handleEvent(event);
            break;
          } else {
            logger.debug(`Not interested event: ${interestedSection}.${interestedMethod}`);
          }
        }
      });
    });

    return this.unsubscribeEventListener;
  }
  /**
   * @description Handle interested event
   * @param {Event} event
   */
  handleEvent(event: Event) {
    // Show what we are busy with
    const types: TypeDef[] = event.typeDef;

    let params = {};
    event.data.forEach((data, index) => {
      logger.info(`\t\t\t${types[index].type}: ${data.toString()}`);
      // @ts-ignore
      params[types[index].type] = data.toString();
    });
    const message = {
      topic: `${event.section}.${event.method}`,
      data: params,
      notification: {
        title: `Received new ${event.section}.${event.method}`,
        body: '',
      },
    };
    // Push event notification to firebase messaging service.
    pushNotification(message);
  }

  /**
   * @description Stop a event listener
   */
  async eventListenerStop() {
    logger.debug('[EventListenerStop] Stopping event listener...');
    if (this.unsubscribeEventListener) {
      (await this.unsubscribeEventListener)();
    }
    this.unsubscribeEventListener = null;
  }

  /**
   * @description Restart event listener
   */
  async eventListenerRestart() {
    logger.debug('[EventListenerRestart] Restarting event listener...');
    await this.eventListenerStop();
    await this.eventListenerStart();
  }

  /**
   * @description Auto-restart event listener
   */
  async eventListenerAutoRestart() {
    await this.eventListenerStart();
    // TODO: check if we really need this, the api instance handles reconnections
    // if (this.firstConnected) {
    //   this.firstConnected = true;
    //   await this.eventListenerStart();
    // } else {
    //   this.wsProvider.on('disconnected', async () => {
    //     await this.eventListenerRestart();
    //   });
    // }
  }
}

// @ts-ignore
const chain = new Chain(config[process.env.CHAIN_NETWORK]);

export default chain;
