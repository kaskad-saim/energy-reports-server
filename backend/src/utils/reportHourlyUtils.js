import moment from 'moment';

export const generateHourlyReport = async (model, {
  averageFields = [],
  deltaFields = []
}, selectedDate = null) => {
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

  const records = await model
    .find({
      timestamp: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
    .sort({ timestamp: 1 });

  const hourlyData = {};

  for (const record of records) {
    const momentTime = moment(record.timestamp);
    const hourKey = momentTime.clone().add(1, 'hour').format('YYYY-MM-DD HH:00');

    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = {
        count: 0,
        deltaValues: {},
        avgSums: {}
      };

      // Инициализируем поля
      deltaFields.forEach(field => {
        hourlyData[hourKey].deltaValues[field] = {
          start: null,
          end: null
        };
      });

      averageFields.forEach(field => {
        hourlyData[hourKey].avgSums[field] = 0;
      });
    }

    const data = record.data;
    hourlyData[hourKey].count += 1;

    // Обработка delta-полей
    deltaFields.forEach(field => {
      const value = data[field];
      if (value !== undefined && value !== null) {
        if (hourlyData[hourKey].deltaValues[field].start === null) {
          hourlyData[hourKey].deltaValues[field].start = value;
        }
        hourlyData[hourKey].deltaValues[field].end = value;
      }
    });

    // Обработка avg-полей
    averageFields.forEach(field => {
      const value = data[field] || 0;
      hourlyData[hourKey].avgSums[field] += value;
    });
  }

  // Формируем результат
  const result = Object.entries(hourlyData).map(([hour, values]) => {
    const report = {
      hour
    };

    // Вычисляем дельты
    deltaFields.forEach(field => {
      const { start, end } = values.deltaValues[field];
      const diff = start !== null && end !== null ? Number((end - start).toFixed(2)) : 0;
      report[`${field}Diff`] = diff;
    });

    // Вычисляем средние
    averageFields.forEach(field => {
      const avg = values.count > 0 ? Number((values.avgSums[field] / values.count).toFixed(2)) : 0;
      report[`${field}Avg`] = avg;
    });

    return report;
  });

  return result;
};