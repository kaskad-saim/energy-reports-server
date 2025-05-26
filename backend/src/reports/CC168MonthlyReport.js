// reports/CC168MonthlyReport.js
import CC168Model from '../models/CC168Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';
import correctionModel from '../models/correctionModel.js';
import { applyCorrectionsToReport } from '../utils/applyCorrections.js';

export const getMonthlyCC168Report = async (selectedDate) => {
  const baseReport = await generateDailyReport(
    CC168Model,
    {
      averageFields: [''],
      deltaFields: ['k295_du20_accumulated', 'k295_du50_accumulated'],
    },
    selectedDate
  );

  const correctionsDoc = await correctionModel.findOne({
    device: 'CC168',
    month: selectedDate,
  });

  const correctedReport = applyCorrectionsToReport(baseReport, correctionsDoc?.corrections);

  return correctedReport;
};
