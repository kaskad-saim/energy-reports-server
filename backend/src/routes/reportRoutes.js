import express from 'express';
import { getHourlyK301Report } from '../reports/k301HourlyReport.js';
import { getHourlyK302Report } from '../reports/k302HourlyReport.js';

const router = express.Router();

router.get('/k301-hourly', async (req, res) => {
  try {
    const report = await getHourlyK301Report();
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});

router.get('/k302-hourly', async (req, res) => {
  try {
    const report = await getHourlyK302Report();
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});

export default router;