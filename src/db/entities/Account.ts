import { Entity, Property, Index } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';

@Entity()
@Index({ properties: ['deviceToken', 'walletAddress'] }) // compound index, with generated name
export class Account extends BaseEntity {
  @Property()
  deviceToken: string;

  @Property()
  walletAddress: string;

  constructor(deviceToken: string, walletAddress: string) {
    super();
    this.deviceToken = deviceToken;
    this.walletAddress = walletAddress;
  }
}
