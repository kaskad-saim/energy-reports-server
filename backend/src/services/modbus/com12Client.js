import { BaseComClient } from './baseClient.js';
import { deviceConfigs } from '../deviceConfig.js';
import { pollBB551 } from '../../objects/BB551.js';
import { pollBB690 } from '../../objects/BB690.js';
import { pollCC125 } from '../../objects/CC125.js';
import { pollCC168 } from '../../objects/CC168.js';
import { pollBB93 } from '../../objects/BB93.js';

export class Com12Client extends BaseComClient {
  constructor() {
    super(deviceConfigs.BB551);
    this.devicePollers = [pollBB551, pollBB93, pollBB690, pollCC125, pollCC168];
  }

  async poll() {
    return super.pollDevices(this.devicePollers);
  }
}

export const com12Client = new Com12Client();