import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollCC168 = async (client) => {
  const deviceName = 'CC168';
  const config = deviceConfigs[deviceName];

  try {
    client.setID(config.slaveId);

    const newData = {
      deviceName: config.deviceName,
      port: config.port,
      baudRate: config.baudRate,
      slaveId: config.slaveId,
      k295_du20_accumulated: parseFloat((await readRegister(client, config.registers.k295_du20_accumulated)).toFixed(2)),
      k295_du50_accumulated: parseFloat((await readRegister(client, config.registers.k295_du50_accumulated)).toFixed(2)),
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