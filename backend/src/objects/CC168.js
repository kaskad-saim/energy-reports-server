import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollCC168 = async (client) => {
  const deviceName = 'CC168';
  const config = deviceConfigs[deviceName];

  // Базовый объект с null значениями
  const baseData = {
    deviceName: config.deviceName,
    port: config.port,
    baudRate: config.baudRate,
    slaveId: config.slaveId,
    k295_du20_accumulated: null,
    k295_du50_accumulated: null,
    timestamp: new Date(),
    error: null
  };

  try {
    client.setID(config.slaveId);

    const newData = {
      ...baseData,
      k295_du20_accumulated: parseFloat((await readRegister(client, config.registers.k295_du20_accumulated)).toFixed(2)),
      k295_du50_accumulated: parseFloat((await readRegister(client, config.registers.k295_du50_accumulated)).toFixed(2)),
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