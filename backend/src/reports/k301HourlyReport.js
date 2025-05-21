import moment from 'moment';
import k301model from '../models/k301model.js';

export const getHourlyK301Report = async (selectedDate = null) => {
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

  const records = await k301model
    .find({
      timestamp: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
    .sort({ timestamp: 1 });

  const hourlyData = {};

  for (const record of records) {
    const hourKey = moment(record.timestamp).format('YYYY-MM-DD HH:00');
    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = {
        count: 0,
        qt1Start: null,
        qt1End: null,
        wt1Sum: 0,
        qo1Sum: 0,
        qo2Sum: 0,
        t1Sum: 0,
        t2Sum: 0,
        p1Sum: 0,
        p2Sum: 0,
        qm1Sum: 0,
        qm2Sum: 0,
      };
    }
    const data = record.data;
    const currentQt1 = data.qt1 || 0;

    if (hourlyData[hourKey].qt1Start === null) {
      hourlyData[hourKey].qt1Start = currentQt1;
    }
    hourlyData[hourKey].qt1End = currentQt1;
    hourlyData[hourKey].count += 1;
    hourlyData[hourKey].wt1Sum += data.wt1 || 0;
    hourlyData[hourKey].qo1Sum += data.qo1 || 0;
    hourlyData[hourKey].qo2Sum += data.qo2 || 0;
    hourlyData[hourKey].t1Sum += data.t1 || 0;
    hourlyData[hourKey].t2Sum += data.t2 || 0;
    hourlyData[hourKey].p1Sum += data.p1 || 0;
    hourlyData[hourKey].p2Sum += data.p2 || 0;
    hourlyData[hourKey].qm1Sum += data.qm1 || 0;
    hourlyData[hourKey].qm2Sum += data.qm2 || 0;
  }

  // Вычисляем значения за каждый час
  const result = Object.entries(hourlyData).map(([hour, values]) => {
    const qt1Diff =
      values.qt1End !== null && values.qt1Start !== null ? Number((values.qt1End - values.qt1Start).toFixed(2)) : 0;
    return {
      hour,
      qt1Diff, // Разница между концом и началом часа
      wt1Avg: Number((values.wt1Sum / values.count).toFixed(2)),
      qo1Avg: Number((values.qo1Sum / values.count).toFixed(2)),
      qo2Avg: Number((values.qo2Sum / values.count).toFixed(2)),
      t1Avg: Number((values.t1Sum / values.count).toFixed(2)),
      t2Avg: Number((values.t2Sum / values.count).toFixed(2)),
      p1Avg: Number((values.p1Sum / values.count).toFixed(2)),
      p2Avg: Number((values.p2Sum / values.count).toFixed(2)),
      qm1Avg: Number((values.qm1Sum / values.count).toFixed(2)),
      qm2Avg: Number((values.qm2Sum / values.count).toFixed(2)),
    };
  });

  return result;
};
