import mongoose from 'mongoose';

const correctionSchema = new mongoose.Schema({
  device: { type: String, required: true },
  month: { type: String, required: true }, // формат "YYYY-MM"
  corrections: {
    type: Object,
    default: {}
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.model('Correction', correctionSchema);