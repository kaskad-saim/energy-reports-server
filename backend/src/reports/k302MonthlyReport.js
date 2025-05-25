// reports/k301MonthlyReport.js

import k302model from '../models/k302Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';


export const getMonthlyK302Report = async (selectedMonth) => {
  return generateDailyReport(
    k302model,
    {
      averageFields: ['wt1', 'qo1', 'qo2', 't1', 't2', 'p1', 'p2', 'qm1', 'qm2'],
      deltaFields: ['qt1']
    },
    selectedMonth
  );
};