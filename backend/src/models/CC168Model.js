import mongoose from 'mongoose';

const CC168Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    deviceName: String,
    port: String,
    baudRate: Number,
    slaveId: Number
  },
  data: {
    k295_du20_accumulated: { type: Number, default: null }, // к295 питьевая ду20 накопл
    k295_du50_accumulated: { type: Number, default: null }, // к295 питьевая ду50 накопл
    error: { type: String, default: null } // Поле для ошибки
  },
  hasError: { type: Boolean, default: false } // Флаг наличия ошибки
});

export default mongoose.model('CC168', CC168Schema);