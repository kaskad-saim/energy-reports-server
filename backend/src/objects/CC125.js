import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollCC125 = async (client) => {
  const deviceName = 'CC125';
  const config = deviceConfigs[deviceName];

  // Базовый объект с null значениями
  const baseData = {
    deviceName: config.deviceName,
    port: config.port,
    baudRate: config.baudRate,
    slaveId: config.slaveId,
    k295a_du50_flow: null,
    k295a_du50_accumulated: null,
    k295_du32_flow: null,
    k295_du32_accumulated: null,
    k296a_du25_flow: null,
    k296a_du25_accumulated: null,
    k295a_du15_flow: null,
    k295a_du15_accumulated: null,
    timestamp: new Date(),
    error: null
  };

  try {
    client.setID(config.slaveId);

    const newData = {
      ...baseData,
      k295a_du50_flow: parseFloat((await readRegister(client, config.registers.k295a_du50_flow)).toFixed(2)),
      k295a_du50_accumulated: parseFloat((await readRegister(client, config.registers.k295a_du50_accumulated)).toFixed(2)),
      k295_du32_flow: parseFloat((await readRegister(client, config.registers.k295_du32_flow)).toFixed(2)),
      k295_du32_accumulated: parseFloat((await readRegister(client, config.registers.k295_du32_accumulated)).toFixed(2)),
      k296a_du25_flow: parseFloat((await readRegister(client, config.registers.k296a_du25_flow)).toFixed(2)),
      k296a_du25_accumulated: parseFloat((await readRegister(client, config.registers.k296a_du25_accumulated)).toFixed(2)),
      k295a_du15_flow: parseFloat((await readRegister(client, config.registers.k295a_du15_flow)).toFixed(2)),
      k295a_du15_accumulated: parseFloat((await readRegister(client, config.registers.k295a_du15_accumulated)).toFixed(2)),
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