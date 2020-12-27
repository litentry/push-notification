import _ from 'lodash';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { Vec } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/create/types.d';
import { EventRecord, Event, Phase } from '@polkadot/types/interfaces';

import logger from 'src/logger';
import { config, Config } from 'src/config';
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
   * @description configuration of the `Chain`
   */
  private config: Config;

  /**
   * @description constructor of Chain
   */
  constructor(config: Config) {
    this.config = config;
    this.wsProvider = new WsProvider(`${config.chain.protocol}://${config.chain.host}:${config.chain.port}`);
    this.keyring = new Keyring({ type: 'sr25519' });

    this.unsubscribeEventListener = null;
  }

  /**
   * @description Connect to a configured block chain, such as `polkadot`, `westend` or `localchain`.
   */
  async connect() {
    this.api = await ApiPromise.create({ provider: this.wsProvider });
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

        // Show what we are busy with
        const types: TypeDef[] = event.typeDef;
        const section: string = event.section;
        const method: string = event.method;

        // if (event.section === 'identity' && event.method === 'JudgementRequested') {
        //   logger.info(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
        //   logger.info(`\t\t${event.meta.documentation.toString()}`);

        //   // Loop through each of the parameters, displaying the type and data
        //   event.data.forEach((data, index) => {
        //     logger.info(`\t\t\t${types[index].type}: ${data.toString()}`);
        //     params[types[index].type] = data.toString();
        //   });
        //   // We only need to emit `handleRequestJudgement` event on our own registrar.
        //   if (params['RegistrarIndex'] == this.config.account.regIndex) {
        //     Event.emit('handleRequestJudgement', params['AccountId']);
        //   }
        // }
        // // TODO: Should we handle cancelRequestJudgement ?
        // if (event.section === 'identity' && event.method === 'JudgementUnrequested') {
        //   logger.info(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
        //   logger.info(`\t\t${event.meta.documentation.toString()}`);

        //   // Loop through each of the parameters, displaying the type and data
        //   event.data.forEach((data, index) => {
        //     logger.info(`\t\t\t${types[index].type}: ${data.toString()}`);
        //     params[types[index].type] = data.toString();
        //   });
        //   // We only need to emit `handleRequestJudgement` event on our own registrar.
        //   if (params['RegistrarIndex'] == this.config.account.regIndex) {
        //     Event.emit('handleUnRequestJudgement', params['AccountId']);
        //   }
        // }
      });
    });

    return this.unsubscribeEventListener;
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
}

const chain = new Chain(config);

export default chain;
