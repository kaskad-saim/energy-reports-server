import BB93Model from '../models/BB93Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';

export const getMonthlyBB93Report = async (selectedDate) => {
  return generateDailyReport(BB93Model, {
    averageFields: ['wt1', 't1', 'p1', 'qo1', 'qm1'],
    deltaFields: []
  }, selectedDate);
};
