import k301model from '../models/k301model.js';
import { generateHourlyReport } from '../utils/reportHourlyUtils.js';

export const getHourlyK301Report = async (selectedDate) => {
  return generateHourlyReport(
    k301model,
    {
      averageFields: ['wt1', 'qo1', 'qo2', 't1', 't2', 'p1', 'p2', 'qm1', 'qm2'],
      deltaFields: ['qt1'],
    },
    selectedDate
  );
};
