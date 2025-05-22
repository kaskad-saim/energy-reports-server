import BB690Model from '../models/BB690Model.js';
import { generateHourlyReport } from '../utils/reportHourlyUtils.js';

export const getHourlyBB690Report = async (selectedDate) => {
  return generateHourlyReport(BB690Model, {
    averageFields: ['wt1', 't1', 'p1', 'qo1', 'qm1'],
    deltaFields: []
  }, selectedDate);
};
