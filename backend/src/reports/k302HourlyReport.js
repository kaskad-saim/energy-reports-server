import k302model from '../models/k302Model.js';
import { generateHourlyReport } from '../utils/reportHourlyUtils.js';

export const getHourlyK302Report = async (selectedDate) => {
  return generateHourlyReport(
    k302model,
    {
      averageFields: ['wt1', 'qo1', 'qo2', 't1', 't2', 'p1', 'p2', 'qm1', 'qm2'],
      deltaFields: ['qt1'],
    },
    selectedDate
  );
};
