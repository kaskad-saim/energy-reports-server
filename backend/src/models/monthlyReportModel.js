// models/monthlyReportModel.js

import mongoose from 'mongoose';

const monthlyReportSchema = new mongoose.Schema({
  device: { type: String, required: true },
  month: { type: String, required: true }, // например: "2025-04"
  reportData: { type: Array, required: true }, // массив объектов с данными
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MonthlyReport', monthlyReportSchema);