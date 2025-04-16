import mongoose from 'mongoose';

const BB551Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    deviceName: String,
    port: String,
    baudRate: Number,
    slaveId: Number
  },
  data: {
    wt1: { type: Number, default: null }, // Гкал/ч
    p1: { type: Number, default: null },  // Давление Мпа
    qo1: { type: Number, default: null }, // Расход м3/ч
    qm1: { type: Number, default: null }, // Расход тонн/ч
    wtAccumulated: { type: Number, default: null }, // Вода техническая накопл. К10б
    wpAccumulated: { type: Number, default: null }, // Вода питьевая накопл. К9а
    wtFlow: { type: Number, default: null }, // Вода техническая м3/ч К10б
    wpFlow: { type: Number, default: null }, // Вода питьевая м3/ч К9а
    error: { type: String, default: null } // Поле для ошибки
  },
  hasError: { type: Boolean, default: false } // Флаг наличия ошибки
});

export default mongoose.model('BB551', BB551Schema);