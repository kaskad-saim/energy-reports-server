import moment from 'moment';

export const generateHourlyReport = async (model, { averageFields = [], deltaFields = [] }, selectedDate = null) => {
  let today;

  if (selectedDate) {
    today = new Date(selectedDate);
    if (isNaN(today)) throw new Error('Неверная дата');
  } else {
    today = new Date();
  }

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Получаем данные из БД
  const records = await model
    .find({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    })
    .sort({ timestamp: 1 });

  const hourlyData = {};

  // Инициализируем часы
  for (let h = 1; h <= 24; h++) {
    const hourStart = moment(today)
      .startOf('day')
      .add(h - 1, 'hours')
      .toDate();
    const hourLabel = moment(hourStart).add(1, 'hour').format('HH:00');

    hourlyData[hourLabel] = {
      values: {},
      deltaValues: {},
    };

    // Инициализируем поля
    deltaFields.forEach((field) => {
      hourlyData[hourLabel].deltaValues[field] = { start: null, end: null };
    });

    averageFields.forEach((field) => {
      hourlyData[hourLabel].values[field] = [];
    });
  }

  // Обрабатываем записи
  for (const record of records) {
    const ts = moment(record.timestamp);
    const hourStart = ts.clone().startOf('hour');
    const hourLabel = hourStart.add(1, 'hour').format('HH:00');

    if (!hourlyData[hourLabel]) continue;

    const data = record.data || {};

    // Дельта
    deltaFields.forEach((field) => {
      const value = data[field];

      if (typeof value === 'number' && !isNaN(value)) {
        if (hourlyData[hourLabel].deltaValues[field].start === null) {
          hourlyData[hourLabel].deltaValues[field].start = value;
        }
        hourlyData[hourLabel].deltaValues[field].end = value;
      }
    });

    // Средние
    averageFields.forEach((field) => {
      const value = data[field];
      if (typeof value === 'number' && !isNaN(value)) {
        hourlyData[hourLabel].values[field].push(value);
      }
    });
  }

  // Формируем финальный отчёт
  const result = Object.entries(hourlyData).map(([hourLabel, data]) => {
    const report = { hour: hourLabel };

    // Дельты
    deltaFields.forEach((field) => {
      const { start, end } = data.deltaValues[field];
      const isValidStart = typeof start === 'number' && !isNaN(start);
      const isValidEnd = typeof end === 'number' && !isNaN(end);

      const diff = isValidStart && isValidEnd ? Number((end - start).toFixed(2)) : 0;
      report[`${field}Diff`] = diff;
    });

    // Средние значения
    averageFields.forEach((field) => {
      const values = data.values[field] || [];
      const avg = values.length > 0 ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0;
      report[`${field}Avg`] = avg;
    });

    return report;
  });

  return result;
};
