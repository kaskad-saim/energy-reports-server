import BB551model from '../models/BB551Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';

export const getMonthlyBB551Report = async (selectedDate) => {
  return generateDailyReport(
    BB551model,
    {
      averageFields: ['wt1', 'p1', 'qo1', 'qm1', 'wtFlow', 'wpFlow'],
      deltaFields: ['wtAccumulated', 'wpAccumulated'],
    },
    selectedDate
  );
};
