// reports/BB551MonthlyReport.js
import BB551model from '../models/BB551Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';
import correctionModel from '../models/correctionModel.js';
import { applyCorrectionsToReport } from '../utils/applyCorrections.js';

export const getMonthlyBB551Report = async (selectedDate) => {
  const baseReport = await generateDailyReport(
    BB551model,
    {
      averageFields: ['wt1', 'p1', 'qo1', 'qm1', 'wtFlow', 'wpFlow'],
      deltaFields: ['wtAccumulated', 'wpAccumulated'],
    },
    selectedDate
  );

  const correctionsDoc = await correctionModel.findOne({
    device: 'BB551',
    month: selectedDate,
  });

  const correctedReport = applyCorrectionsToReport(baseReport, correctionsDoc?.corrections);

  return correctedReport;
};