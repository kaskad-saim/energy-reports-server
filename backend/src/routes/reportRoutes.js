import express from 'express';
import monthlyReportModel from '../models/monthlyReportModel.js';
import { getHourlyK301Report } from '../reports/k301HourlyReport.js';
import { getHourlyK302Report } from '../reports/k302HourlyReport.js';
import { getHourlyBB690Report } from '../reports/BB690HourlyReport.js';
import { getHourlyBB93Report } from '../reports/BB93HourlyReport.js';
import { getHourlyBB551Report } from '../reports/BB551HourlyReport.js';
import { getHourlyCC125Report } from '../reports/CC125HourlyReport.js';
import { getHourlyCC168Report } from '../reports/CC168HourlyReport.js';
import { getMonthlyK301Report } from '../reports/k301MonthlyReport.js';
import { getMonthlyK302Report } from '../reports/k302MonthlyReport.js';
import { getMonthlyCC168Report } from '../reports/CC168MonthlyReport.js';
import { getMonthlyBB690Report } from '../reports/BB690MonthlyReport.js';
import { getMonthlyBB93Report } from '../reports/BB93MonthlyReport.js';
import { getMonthlyBB551Report } from '../reports/BB551MonthlyReport.js';
import { getMonthlyCC125Report } from '../reports/CC125MonthlyReport.js';

const router = express.Router();

// Сопоставление устройств с функциями
const hourlyReportMap = {
  k301: getHourlyK301Report,
  k302: getHourlyK302Report,
  BB690: getHourlyBB690Report,
  BB93: getHourlyBB93Report,
  BB551: getHourlyBB551Report,
  CC125: getHourlyCC125Report,
  CC168: getHourlyCC168Report,
};

const monthlyReportMap = {
  k301: getMonthlyK301Report,
  k302: getMonthlyK302Report,
  CC168: getMonthlyCC168Report,
  BB690: getMonthlyBB690Report,
  BB93: getMonthlyBB93Report,
  BB551: getMonthlyBB551Report,
  CC125: getMonthlyCC125Report,
};

// Универсальный маршрут для часовых отчетов
router.get('/:device-hourly', async (req, res) => {
  const { device } = req.params;
  const { date } = req.query;

  const handler = hourlyReportMap[device];

  if (!handler) {
    return res.status(404).json({ error: `Часовой отчет для ${device} не найден` });
  }

  try {
    const report = await handler(date);
    return res.json(report);
  } catch (error) {
    console.error(`Ошибка при формировании часового отчета для ${device}:`, error);
    return res.status(500).json({ error: `Не удалось сформировать часовой отчет для ${device}` });
  }
});

// Универсальный маршрут для месячных отчетов
router.get('/:device-monthly', async (req, res) => {
  const { device } = req.params;
  const { month } = req.query;

  const handler = monthlyReportMap[device];

  if (!handler) {
    return res.status(404).json({ error: `Месячный отчет для ${device} не найден` });
  }

  try {
    const cached = await monthlyReportModel.findOne({ device, month }).sort({ updatedAt: -1 }).limit(1);

    if (cached) {
      return res.json(cached.reportData);
    }

    // Если кэша нет, генерируем вручную
    const report = await handler(month);
    return res.json(report);
  } catch (error) {
    console.error(`Ошибка при получении месячного отчета для ${device}:`, error);
    return res.status(500).json({ error: `Ошибка сервера при получении отчета для ${device}` });
  }
});

export default router;
