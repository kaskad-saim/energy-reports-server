import BB690Model from '../models/BB690Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';

export const getMonthlyBB690Report = async (selectedDate) => {
  return generateDailyReport(BB690Model, {
    averageFields: ['wt1', 't1', 'p1', 'qo1', 'qm1'],
    deltaFields: []
  }, selectedDate);
};
