import { com11Client } from './com11Client.js';
import { com12Client } from './com12Client.js';
import { saveDataToDB } from '../dataBase.js';
import { ModbusSimulator } from '../modbusSimulator.js';

export class ComPortManager {
  constructor() {
    // Перенесем инициализацию в отдельный метод
    this.initialized = false;
    this.timeoutId = null;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('ComPortManager NODE_ENV:', process.env.NODE_ENV);
    console.log('ComPortManager PORT:', process.env.PORT);

    this.isProduction = process.env.NODE_ENV === 'production';

    if (this.isProduction) {
      this.clients = [com11Client, com12Client];
    } else {
      this.simulator = new ModbusSimulator();
      this.deviceNames = ['k301', 'k302', 'BB551', 'BB93', 'BB690', 'CC125', 'CC168'];
    }

    this.pollInterval = 5000;
    this.saveInterval = 60000;
    this.lastSaveTime = Date.now();
    this.initialized = true;
  }

  async pollAll() {
    try {
      if (this.isProduction) {
        // Реальный режим - опрашиваем клиенты
        for (const client of this.clients) {
          await client.poll();
        }
      } else {
        // Режим разработки - используем симулятор
        for (const deviceName of this.deviceNames) {
          await this.simulator.pollDevice(deviceName);
        }
      }

      // Проверяем нужно ли сохранять в БД
      const now = Date.now();
      if (now - this.lastSaveTime >= this.saveInterval) {
        this.lastSaveTime = now;
        await this.saveAllData();
      }
    } catch (err) {
      console.error('Ошибка при опросе устройств:', err);
    } finally {
      this.scheduleNextPoll();
    }
  }
  async saveAllData() {
    try {
      const deviceNames = ['k301', 'k302', 'BB551', 'BB93', 'BB690', 'CC125', 'CC168'];

      for (const deviceName of deviceNames) {
        await saveDataToDB(deviceName);
      }

      console.log('Все данные сохранены в БД');
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  }

  scheduleNextPoll() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.pollAll(), this.pollInterval);
  }

  startPolling() {
    console.log('Запуск опроса устройств...');
    this.pollAll();
  }

  stopPolling() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    console.log('Опрос устройств остановлен');
  }
}

export const comPortManager = new ComPortManager();
