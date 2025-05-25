// reports/k301MonthlyReport.js

import k301model from '../models/k301model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';

export const getMonthlyK301Report = async (selectedMonth) => {
  return generateDailyReport(
    k301model,
    {
      averageFields: ['wt1', 'qo1', 'qo2', 't1', 't2', 'p1', 'p2', 'qm1', 'qm2'],
      deltaFields: ['qt1'],
    },
    selectedMonth
  );
};
