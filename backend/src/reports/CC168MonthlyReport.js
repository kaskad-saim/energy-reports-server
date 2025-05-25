import CC168Model from '../models/CC168Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';

export const getMonthlyCC168Report = async (selectedDate) => {
  return generateDailyReport(
    CC168Model,
    {
      averageFields: [''],
      deltaFields: [
        'k295_du20_accumulated',
        'k295_du50_accumulated',
      ],
    },
    selectedDate
  );
};
