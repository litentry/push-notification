import { Entity, Property, Index, ArrayType } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';

@Entity()
@Index({ properties: ['deviceToken', 'walletAddress'] }) // compound index, with generated name
export class Account extends BaseEntity {
  @Property({ nullable: false })
  deviceToken: string;

  @Property({ nullable: false })
  walletAddress: string;

  @Property({ type: ArrayType, nullable: true })
  events: string[];

  constructor(deviceToken: string, walletAddress: string, events=[]) {
    super();
    this.deviceToken = deviceToken;
    this.walletAddress = walletAddress;
    this.events = events;
  }
}
