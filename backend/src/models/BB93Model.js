import mongoose from 'mongoose';

const BB93Schema = new mongoose.Schema({
  deviceInfo: {
    deviceName: String,
    port: String,
    baudRate: Number,
    slaveId: Number,
  },
  data: {
    wt1: { type: Number, default: null },
    p1: { type: Number, default: null },
    qo1: { type: Number, default: null },
    qm1: { type: Number, default: null },
    wtAccumulated: { type: Number, default: null },
    wpAccumulated: { type: Number, default: null },
    wtFlow: { type: Number, default: null },
    wpFlow: { type: Number, default: null },
    error: { type: String, default: null }, 
  },
  timestamp: { type: Date, default: Date.now },
  hasError: { type: Boolean, default: false },
});

export default mongoose.model('BB93', BB93Schema);