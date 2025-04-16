import mongoose from 'mongoose';

const k302Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    deviceName: String,
    port: String,
    baudRate: Number,
    slaveId: Number
  },
  data: {
    qt1: { type: Number, default: null }, // Гкал/накопл
    wt1: { type: Number, default: null }, // Гкал/ч
    qo1: { type: Number, default: null }, // Расход прямой м3/ч
    qo2: { type: Number, default: null }, // Расход обратный м3/ч
    t1: { type: Number, default: null }, // Температура прямая
    t2: { type: Number, default: null }, // Температура обратная
    p1: { type: Number, default: null }, // Давление прямое
    p2: { type: Number, default: null }, // Давление обратное
    qm1: { type: Number, default: null }, // Расход прямой тонн/ч
    qm2: { type: Number, default: null }, // Расход обратный тонн/ч
    error: { type: String, default: null } // Поле для ошибки
  },
  hasError: { type: Boolean, default: false } // Флаг наличия ошибки
});

export default mongoose.model('K302', k302Schema);