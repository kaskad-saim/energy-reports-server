import { readRegister } from '../services/modbusSerial.js';
import { deviceConfigs } from '../services/deviceConfig.js';
import { updateDeviceData } from '../services/dataStore.js';

export const pollBB93 = async (client) => {
  const deviceName = 'BB93';
  const config = deviceConfigs[deviceName];

  // Создаем базовый объект данных с null значениями
  const baseData = {
    deviceName: config.deviceName,
    port: config.port,
    baudRate: config.baudRate,
    slaveId: config.slaveId,
    wt1: null,
    p1: null,
    qo1: null,
    qm1: null,
    wtAccumulated: null,
    wpAccumulated: null,
    wtFlow: null,
    wpFlow: null,
    timestamp: new Date(),
    error: null
  };

  try {
    client.setID(config.slaveId);

    // Обновляем только те поля, которые успешно прочитались
    const newData = {
      ...baseData,
      wt1: parseFloat((await readRegister(client, config.registers.wt1)).toFixed(2)),
      p1: parseFloat((await readRegister(client, config.registers.p1)).toFixed(2)),
      qo1: parseFloat((await readRegister(client, config.registers.qo1)).toFixed(2)),
      qm1: parseFloat((await readRegister(client, config.registers.qm1)).toFixed(2)),
      error: null
    };

    updateDeviceData(deviceName, newData);
    console.log(`Данные ${deviceName} обновлены`);

  } catch (err) {
    console.error(`Ошибка опроса ${deviceName}:`, err.message);
    // При ошибке отправляем базовые данные с null значениями и сообщением об ошибке
    updateDeviceData(deviceName, {
      ...baseData,
      error: err.message
    });
  }
};