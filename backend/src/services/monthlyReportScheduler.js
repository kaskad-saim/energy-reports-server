// services/monthlyReportScheduler.js

import { getMonthlyK301Report } from '../reports/k301MonthlyReport.js';
import { getMonthlyK302Report } from '../reports/k302MonthlyReport.js';
import MonthlyReport from '../models/monthlyReportModel.js';
import { getMonthlyCC168Report } from '../reports/CC168MonthlyReport.js';
import { getMonthlyBB690Report } from '../reports/BB690MonthlyReport.js';
import { getMonthlyBB93Report } from '../reports/BB93MonthlyReport.js';
import { getMonthlyBB551Report } from '../reports/BB551MonthlyReport.js';
import { getMonthlyCC125Report } from '../reports/CC125MonthlyReport.js';

export const scheduleMonthlyReports = () => {
  setInterval(async () => {
    try {
      const now = new Date();
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Генерация отчетов для разных устройств
      const devices = [
        { name: 'k301', generator: getMonthlyK301Report },
        { name: 'k302', generator: getMonthlyK302Report },
        { name: 'CC168', generator: getMonthlyCC168Report },
        { name: 'BB690', generator: getMonthlyBB690Report },
        { name: 'BB93', generator: getMonthlyBB93Report },
        { name: 'BB551', generator: getMonthlyBB551Report },
        { name: 'CC125', generator: getMonthlyCC125Report },
      ];

      for (const device of devices) {
        const report = await device.generator(monthStr);

        await MonthlyReport.findOneAndUpdate(
          { device: device.name, month: monthStr },
          { reportData: report, updatedAt: new Date() },
          { upsert: true, new: true }
        );

        console.log(`✅ Месячный отчет для ${device.name} успешно обновлен`);
      }
    } catch (error) {
      console.error('❌ Ошибка при фоновой генерации отчета:', error);
    }
  }, 1 * 60 * 1000); // каждые 30 минут
};
