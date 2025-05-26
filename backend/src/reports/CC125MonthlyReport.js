// reports/CC125MonthlyReport.js

import CC125Model from '../models/CC125Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';
import correctionModel from '../models/correctionModel.js';
import { applyCorrectionsToReport } from '../utils/applyCorrections.js'; 

export const getMonthlyCC125Report = async (selectedDate) => {
  const baseReport = await generateDailyReport(
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

  const correctionsDoc = await correctionModel.findOne({
    device: 'CC125',
    month: selectedDate,
  });

  const correctedReport = applyCorrectionsToReport(baseReport, correctionsDoc?.corrections);

  return correctedReport;
};
