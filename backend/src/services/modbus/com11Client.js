import { BaseComClient } from './baseClient.js';
import { deviceConfigs } from '../deviceConfig.js';
import { pollK301 } from '../../objects/k301.js';
import { pollK302 } from '../../objects/k302.js';

export class Com11Client extends BaseComClient {
  constructor() {
    super(deviceConfigs.k301);
    this.devicePollers = [pollK301, pollK302];
  }

  async poll() {
    return super.pollDevices(this.devicePollers);
  }
}

export const com11Client = new Com11Client();