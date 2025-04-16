import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollBB551 = async (client) => {
  const deviceName = 'BB551';
  const config = deviceConfigs[deviceName];

  try {
    client.setID(config.slaveId);

    const newData = {
      deviceName: config.deviceName,
      port: config.port,
      baudRate: config.baudRate,
      slaveId: config.slaveId,
      wt1: parseFloat((await readRegister(client, config.registers.wt1)).toFixed(2)),
      p1: parseFloat((await readRegister(client, config.registers.p1)).toFixed(2)),
      qo1: parseFloat((await readRegister(client, config.registers.qo1)).toFixed(2)),
      qm1: parseFloat((await readRegister(client, config.registers.qm1)).toFixed(2)),
      wtAccumulated: parseFloat((await readRegister(client, config.registers.wtAccumulated)).toFixed(2)),
      wpAccumulated: parseFloat((await readRegister(client, config.registers.wpAccumulated)).toFixed(2)),
      wtFlow: parseFloat((await readRegister(client, config.registers.wtFlow)).toFixed(2)),
      wpFlow: parseFloat((await readRegister(client, config.registers.wpFlow)).toFixed(2)),
      timestamp: new Date(),
      error: null
    };

    updateDeviceData(deviceName, newData);
    console.log(`Данные ${deviceName} обновлены`);

  } catch (err) {
    console.error(`Ошибка опроса ${deviceName}:`, err.message);
    updateDeviceData(deviceName, {
      deviceName: config.deviceName,
      port: config.port,
      baudRate: config.baudRate,
      slaveId: config.slaveId,
      error: err.message,
      timestamp: new Date()
    });
  }
};