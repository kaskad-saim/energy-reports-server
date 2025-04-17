import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollK301 = async (client) => {
  const deviceName = 'k301';
  const config = deviceConfigs[deviceName];

  // Базовый объект с null значениями
  const baseData = {
    deviceName: config.deviceName,
    port: config.port,
    baudRate: config.baudRate,
    slaveId: config.slaveId,
    qt1: null,
    wt1: null,
    qo1: null,
    qo2: null,
    t1: null,
    t2: null,
    p1: null,
    p2: null,
    qm1: null,
    qm2: null,
    timestamp: new Date(),
    error: null
  };

  try {
    client.setID(config.slaveId);

    const newData = {
      ...baseData,
      qt1: parseFloat((await readRegister(client, config.registers.qt1)).toFixed(2)),
      wt1: parseFloat((await readRegister(client, config.registers.wt1)).toFixed(2)),
      qo1: parseFloat((await readRegister(client, config.registers.qo1)).toFixed(2)),
      qo2: parseFloat((await readRegister(client, config.registers.qo2)).toFixed(2)),
      t1: parseFloat((await readRegister(client, config.registers.t1)).toFixed(2)),
      t2: parseFloat((await readRegister(client, config.registers.t2)).toFixed(2)),
      p1: parseFloat((await readRegister(client, config.registers.p1)).toFixed(2)),
      p2: parseFloat((await readRegister(client, config.registers.p2)).toFixed(2)),
      qm1: parseFloat((await readRegister(client, config.registers.qm1)).toFixed(2)),
      qm2: parseFloat((await readRegister(client, config.registers.qm2)).toFixed(2)),
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