import mongoose from 'mongoose';
import k301model from '../models/k301model.js';
import k302Model from '../models/k302Model.js';
import BB551Model from '../models/BB551Model.js';
import BB690Model from '../models/BB690Model.js';
import CC125Model from '../models/CC125Model.js';
import CC168Model from '../models/CC168Model.js';
import BB93Model from '../models/BB93Model.js';
import { getDeviceData } from './dataStore.js';

const mongoURI = 'mongodb://127.0.0.1:27017/energy-resources';

// Подключение к MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Подключено к MongoDB');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  }
};

// Маппинг моделей
export const modelsMap = {
  k301: k301model,
  k302: k302Model,
  BB551: BB551Model,
  BB93: BB93Model,
  BB690: BB690Model,
  CC125: CC125Model,
  CC168: CC168Model,
};

// Функция для сохранения данных в базу
export const saveDataToDB = async (deviceName) => {
  try {
    const Model = modelsMap[deviceName];
    if (!Model) {
      throw new Error(`Модель для устройства ${deviceName} не найдена`);
    }

    const deviceData = getDeviceData(deviceName);
    if (!deviceData) return;

    const record = new Model({
      deviceInfo: {
        deviceName: deviceData.deviceName,
        port: deviceData.port,
        baudRate: deviceData.baudRate,
        slaveId: deviceData.slaveId,
      },
      data: deviceData,
      timestamp: deviceData.timestamp,
      hasError: !!deviceData.error
    });

    await record.save();
    console.log(`Данные ${deviceName} сохранены в MongoDB`);
  } catch (error) {
    console.error(`Ошибка при сохранении данных устройства ${deviceName}:`, error);
  }
};