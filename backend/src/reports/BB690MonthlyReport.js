// reports/BB690MonthlyReport.js
import BB690Model from '../models/BB690Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';
import correctionModel from '../models/correctionModel.js';
import { applyCorrectionsToReport } from '../utils/applyCorrections.js';

export const getMonthlyBB690Report = async (selectedDate) => {
  const baseReport = await generateDailyReport(
    BB690Model,
    {
      averageFields: ['wt1', 't1', 'p1', 'qo1', 'qm1'],
      deltaFields: [],
    },
    selectedDate
  );

  const correctionsDoc = await correctionModel.findOne({
    device: 'BB690',
    month: selectedDate,
  });

  const correctedReport = applyCorrectionsToReport(baseReport, correctionsDoc?.corrections);

  return correctedReport;
};