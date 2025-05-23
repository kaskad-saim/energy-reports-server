import CC168Model from '../models/CC168Model.js';
import { generateHourlyReport } from '../utils/reportHourlyUtils.js';

export const getHourlyCC168Report = async (selectedDate) => {
  return generateHourlyReport(
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
