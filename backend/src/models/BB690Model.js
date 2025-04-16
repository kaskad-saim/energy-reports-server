import mongoose from 'mongoose';

const BB690Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    deviceName: String,
    port: String,
    baudRate: Number,
    slaveId: Number,
  },
  data: {
    wt1: { type: Number, default: null }, // Гкал/ч
    t1: { type: Number, default: null }, // Температура
    p1: { type: Number, default: null }, // Давление Мпа
    qo1: { type: Number, default: null }, // Расход м3/ч
    qm1: { type: Number, default: null }, // Расход тонн/ч
    error: { type: String, default: null }, // Поле для ошибки
  },
  hasError: { type: Boolean, default: false }, // Флаг наличия ошибки
});

export default mongoose.model('BB690', BB690Schema);
