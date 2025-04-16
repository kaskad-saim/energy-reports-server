import { connectToModbus } from '../modbusSerial.js';

export class BaseComClient {
  constructor(portConfig) {
    this.portConfig = portConfig;
    this.client = null;
    this.connectionAttempts = 0;
  }

  async initialize() {
    try {
      if (!this.client || !this.client.isOpen) {
        this.client = await connectToModbus(this.portConfig);
        this.connectionAttempts = 0;
        console.log(`Подключение к ${this.portConfig.port} установлено`);
      }
      return this.client;
    } catch (err) {
      this.connectionAttempts++;
      console.error(`Ошибка подключения к ${this.portConfig.port} (попытка ${this.connectionAttempts}):`, err.message);

      // Принудительно закрываем соединение при ошибке
      if (this.client) {
        try {
          await this.client.close();
        } catch (closeErr) {
          console.error('Ошибка при закрытии соединения:', closeErr);
        }
        this.client = null;
      }

      throw err;
    }
  }

  async pollDevices(devicePollers) {
    try {
      await this.initialize();
      for (const poller of devicePollers) {
        await poller(this.client);
      }
    } catch (err) {
      console.error('Ошибка в BaseComClient:', err);
      throw err;
    }
  }
}
