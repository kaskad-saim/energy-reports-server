import { deviceConfigs } from './deviceConfig.js';
import { updateDeviceData } from './dataStore.js';

export class ModbusSimulator {
  constructor() {
    this.deviceValues = {};
    this.initializeValues();
  }

  // Инициализация начальных значений для всех устройств
  initializeValues() {
    Object.keys(deviceConfigs).forEach(deviceName => {
      const config = deviceConfigs[deviceName];
      this.deviceValues[deviceName] = {};

      // Генерируем начальные значения для каждого регистра
      Object.keys(config.registers).forEach(register => {
        this.deviceValues[deviceName][register] = this.generateInitialValue(register);
      });
    });
  }

  // Генерация начального значения в зависимости от типа регистра
  generateInitialValue(register) {
    const registerType = register.substring(0, 2); // Первые 2 символа определяют тип данных

    switch(registerType) {
      case 'qt': // тепловая энергия (Гкал)
        return (Math.random() * 1000).toFixed(2);
      case 'wt': // мощность (Гкал/ч)
        return (Math.random() * 10).toFixed(2);
      case 'qo': // объемный расход (м3/ч)
        return (Math.random() * 50).toFixed(2);
      case 'qm': // массовый расход (тонн/ч)
        return (Math.random() * 40).toFixed(2);
      case 't':  // температура (°C)
        return (Math.random() * 100 + 20).toFixed(1);
      case 'p':  // давление (МПа)
        return (Math.random() * 1.5).toFixed(3);
      default:
        return (Math.random() * 100).toFixed(2);
    }
  }

  // Симуляция чтения регистра
  async readRegister(deviceName, address) {
    const config = deviceConfigs[deviceName];
    if (!config) {
      throw new Error(`Конфигурация для устройства ${deviceName} не найдена`);
    }

    // Находим имя регистра по адресу
    const registerName = Object.keys(config.registers).find((reg) => config.registers[reg] === address);

    if (!registerName) {
      throw new Error(`Регистр с адресом 0x${address.toString(16)} не найден`);
    }

    // Получаем текущее значение
    let currentValue = parseFloat(this.deviceValues[deviceName][registerName]);

    // Защита от NaN
    if (isNaN(currentValue)) {
      currentValue = 0; // или любое другое начальное значение
    }

    // Генерируем небольшое изменение значения
    const change = (Math.random() - 0.5) * 0.1 * currentValue;

    // Вычисляем новое значение, не позволяя ему уйти в минус
    let newValue = currentValue + change;

    // Ограничиваем минимальное значение 0
    newValue = Math.max(0, newValue);

    // Сохраняем значение
    this.deviceValues[deviceName][registerName] = newValue.toFixed(2);

    return parseFloat(this.deviceValues[deviceName][registerName]);
  }

  // Симуляция опроса устройства
  async pollDevice(deviceName) {
    const config = deviceConfigs[deviceName];
    if (!config) {
      throw new Error(`Конфигурация для устройства ${deviceName} не найдена`);
    }

    const newData = {
      deviceName: config.deviceName,
      port: config.port,
      baudRate: config.baudRate,
      slaveId: config.slaveId,
      timestamp: new Date(),
      error: null
    };

    // Читаем все регистры для устройства
    for (const [register, address] of Object.entries(config.registers)) {
      try {
        newData[register] = await this.readRegister(deviceName, address);
      } catch (err) {
        newData.error = err.message;
      }
    }

    // Обновляем данные в хранилище
    updateDeviceData(deviceName, newData);

    return newData;
  }
}