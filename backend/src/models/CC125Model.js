import mongoose from 'mongoose';

const CC125Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    deviceName: String,
    port: String,
    baudRate: Number,
    slaveId: Number,
  },
  data: {
    k295a_du50_flow: { type: Number, default: null }, // к295а питьевая ду50 м3/ч
    k295a_du50_accumulated: { type: Number, default: null }, // к295а питьевая ду50 накопл
    k295_du32_flow: { type: Number, default: null }, // к295 питьевая ду32 м3/ч
    k295_du32_accumulated: { type: Number, default: null }, // к295 питьевая ду32 накопл
    k296a_du25_flow: { type: Number, default: null }, // к296а речная ду25 м3/ч
    k296a_du25_accumulated: { type: Number, default: null }, // к296а речная ду25 накопл
    k295a_du15_flow: { type: Number, default: null }, // к295а питьевая ду15 м3/ч
    k295a_du15_accumulated: { type: Number, default: null }, // к295а питьевая ду15 накопл
    error: { type: String, default: null }, // Поле для ошибки
  },
  hasError: { type: Boolean, default: false }, // Флаг наличия ошибки
});

export default mongoose.model('CC125', CC125Schema);
