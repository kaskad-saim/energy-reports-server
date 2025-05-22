import BB551model from '../models/BB551Model.js';
import { generateHourlyReport } from '../utils/reportHourlyUtils.js';

export const getHourlyBB551Report = async (selectedDate) => {
  return generateHourlyReport(
    BB551model,
    {
      averageFields: ['wt1', 'p1', 'qo1', 'qm1', 'wtFlow', 'wpFlow'],
      deltaFields: ['wtAccumulated', 'wpAccumulated'],
    },
    selectedDate
  );
};
