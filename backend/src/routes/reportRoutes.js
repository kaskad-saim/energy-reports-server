import express from 'express';
import { getHourlyK301Report } from '../reports/k301HourlyReport.js';
import { getHourlyK302Report } from '../reports/k302HourlyReport.js';
import { getHourlyBB690Report } from '../reports/BB690HourlyReport.js';
import { getHourlyBB93Report } from '../reports/BB93HourlyReport.js';
import { getHourlyBB551Report } from '../reports/BB551HourlyReport.js';

const router = express.Router();

router.get('/k301-hourly', async (req, res) => {
  const { date } = req.query;
  try {
    const report = await getHourlyK301Report(date);
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});

router.get('/k302-hourly', async (req, res) => {
  const { date } = req.query;
  try {
    const report = await getHourlyK302Report(date);
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});

router.get('/BB690-hourly', async (req, res) => {
  const { date } = req.query;
  try {
    const report = await getHourlyBB690Report(date);
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});


router.get('/BB93-hourly', async (req, res) => {
  const { date } = req.query;
  try {
    const report = await getHourlyBB93Report(date);
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});

router.get('/BB551-hourly', async (req, res) => {
  const { date } = req.query;
  try {
    const report = await getHourlyBB551Report(date);
    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    res.status(500).json({ error: 'Не удалось сформировать отчет' });
  }
});

export default router;
