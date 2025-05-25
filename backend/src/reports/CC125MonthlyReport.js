import CC125Model from '../models/CC125Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';

export const getMonthlyCC125Report = async (selectedDate) => {
  return generateDailyReport(
    CC125Model,
    {
      averageFields: ['k295a_du50_flow', 'k295_du32_flow', 'k296a_du25_flow', 'k295a_du15_flow'],
      deltaFields: [
        'k295a_du50_accumulated',
        'k295_du32_accumulated',
        'k296a_du25_accumulated',
        'k295a_du15_accumulated',
      ],
    },
    selectedDate
  );
};
