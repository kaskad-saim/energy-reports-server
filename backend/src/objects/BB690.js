import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollBB690 = async (client) => {
  const deviceName = 'BB690';
  const config = deviceConfigs[deviceName];

  // Базовый объект с null значениями
  const baseData = {
    deviceName: config.deviceName,
    port: config.port,
    baudRate: config.baudRate,
    slaveId: config.slaveId,
    wt1: null,
    t1: null,
    p1: null,
    qo1: null,
    qm1: null,
    timestamp: new Date(),
    error: null
  };

  try {
    client.setID(config.slaveId);

    const newData = {
      ...baseData,
      wt1: parseFloat((await readRegister(client, config.registers.wt1)).toFixed(2)),
      t1: parseFloat((await readRegister(client, config.registers.t1)).toFixed(2)),
      p1: parseFloat((await readRegister(client, config.registers.p1)).toFixed(2)),
      qo1: parseFloat((await readRegister(client, config.registers.qo1)).toFixed(2)),
      qm1: parseFloat((await readRegister(client, config.registers.qm1)).toFixed(2)),
      error: null
    };

    updateDeviceData(deviceName, newData);
    console.log(`Данные ${deviceName} обновлены`);

  } catch (err) {
    console.error(`Ошибка опроса ${deviceName}:`, err.message);
    updateDeviceData(deviceName, {
      ...baseData,
      error: err.message
    });
  }
};