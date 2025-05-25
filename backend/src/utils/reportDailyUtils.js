import moment from 'moment';
import { generateHourlyReport } from './reportHourlyUtils.js';

export const generateDailyReport = async (model, { averageFields = [], deltaFields = [] }, selectedMonth = null) => {
  let date;
  if (selectedMonth) {
    date = new Date(selectedMonth);
    if (isNaN(date)) throw new Error('Неверная дата');
  } else {
    date = new Date();
  }

  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const dailyData = {};

  for (let dayOffset = 0; dayOffset < moment(endOfMonth).diff(startOfMonth, 'days') + 1; dayOffset++) {
    const currentDate = moment(startOfMonth).add(dayOffset, 'days').toDate();
    const dayKey = moment(currentDate).format('YYYY-MM-DD');

    // Инициализируем структуру для дня
    dailyData[dayKey] = {
      deltaValues: {},
      hourlySums: {},
      hourlyReports: [], // Добавляем хранилище для часовых отчётов
    };

    // Инициализируем поля
    deltaFields.forEach((field) => {
      dailyData[dayKey].deltaValues[field] = { start: null, end: null };
    });

    averageFields.forEach((field) => {
      dailyData[dayKey].hourlySums[field] = 0;
    });

    // Генерируем часовой отчёт и сохраняем его
    const hourlyReport = await generateHourlyReport(model, { averageFields, deltaFields }, currentDate);
    dailyData[dayKey].hourlyReports = hourlyReport; // Сохраняем часовой отчёт

    // Обрабатываем каждый час
    hourlyReport.forEach((hourEntry) => {
      // Средние значения
      averageFields.forEach((field) => {
        const value = hourEntry[`${field}Avg`] || 0;
        dailyData[dayKey].hourlySums[field] += value * 1;
      });

      // Дельты
      deltaFields.forEach((field) => {
        const diffKey = `${field}Diff`;
        const diffData = hourEntry[diffKey];

        if (!diffData || typeof diffData.start !== 'number' || typeof diffData.end !== 'number') {
          return;
        }

        const { start, end } = diffData;

        if (dailyData[dayKey].deltaValues[field].start === null) {
          dailyData[dayKey].deltaValues[field].start = start;
        }
        dailyData[dayKey].deltaValues[field].end = end;
      });
    });
  }

  // Формируем финальный результат
  const result = Object.entries(dailyData).map(([day, data]) => {
    const report = { day };

    // Обработка дельт - используем сохранённые hourlyReports
    deltaFields.forEach((field) => {
      let dailyDiff = 0;
      data.hourlyReports.forEach((hourEntry) => {
        dailyDiff += hourEntry[`${field}Diff`] || 0;
      });
      report[`${field}Diff`] = Number(dailyDiff.toFixed(2));
    });

    // Обработка средних значений
    averageFields.forEach((field) => {
      const sum = Number(data.hourlySums[field].toFixed(2));
      report[`${field}DaySum`] = sum;
    });

    return report;
  });

  return result;
};
