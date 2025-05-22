import BB93Model from '../models/BB93Model.js';
import { generateHourlyReport } from '../utils/reportHourlyUtils.js';

export const getHourlyBB93Report = async (selectedDate) => {
  return generateHourlyReport(BB93Model, {
    averageFields: ['wt1', 't1', 'p1', 'qo1', 'qm1'],
    deltaFields: []
  }, selectedDate);
};
