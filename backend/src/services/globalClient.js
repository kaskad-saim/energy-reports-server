import { comPortManager } from './modbus/comPortManager.js';

// globalClient.js
export const pollDevicesWithSharedConnection = async () => {
  await comPortManager.initialize();
  comPortManager.startPolling();
};

// Для остановки опроса (если нужно)
export const stopPolling = () => {
  comPortManager.stopPolling();
};
