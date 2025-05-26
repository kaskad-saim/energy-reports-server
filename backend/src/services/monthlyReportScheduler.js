// services/monthlyReportScheduler.js
import cron from 'node-cron';
import { getMonthlyK301Report } from '../reports/k301MonthlyReport.js';
import { getMonthlyK302Report } from '../reports/k302MonthlyReport.js';
import MonthlyReport from '../models/monthlyReportModel.js';
import { getMonthlyCC168Report } from '../reports/CC168MonthlyReport.js';
import { getMonthlyBB690Report } from '../reports/BB690MonthlyReport.js';
import { getMonthlyBB93Report } from '../reports/BB93MonthlyReport.js';
import { getMonthlyBB551Report } from '../reports/BB551MonthlyReport.js';
import { getMonthlyCC125Report } from '../reports/CC125MonthlyReport.js';

export const scheduleMonthlyReports = () => {
  // Запускаем каждые 5 минут для тестирования ('*/5 * * * *')
  cron.schedule('*/5 * * * *', async () => {
    console.log('⏱️ Запуск генерации месячных отчетов...');

    try {
      const now = new Date();
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

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
        const startTime = Date.now();
        console.log(`🔄 Начало генерации отчета для ${device.name}...`);

        const report = await device.generator(monthStr);

        await MonthlyReport.findOneAndUpdate(
          { device: device.name, month: monthStr },
          { reportData: report, updatedAt: new Date() },
          { upsert: true, new: true }
        );

        const timeTaken = (Date.now() - startTime) / 1000;
        console.log(`✅ Отчет для ${device.name} обновлен (${timeTaken.toFixed(2)} сек)`);
      }

      console.log('✅ Все месячные отчеты успешно сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка при генерации отчетов:', error);
    }
  });
};