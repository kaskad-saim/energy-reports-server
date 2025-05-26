// reports/BB93MonthlyReport.js

import BB93Model from '../models/BB93Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';
import correctionModel from '../models/correctionModel.js';
import { applyCorrectionsToReport } from '../utils/applyCorrections.js';

export const getMonthlyBB93Report = async (selectedDate) => {
  const baseReport = await generateDailyReport(
    BB93Model,
    {
      averageFields: ['wt1', 't1', 'p1', 'qo1', 'qm1'],
      deltaFields: [],
    },
    selectedDate
  );

  const correctionsDoc = await correctionModel.findOne({
    device: 'BB93',
    month: selectedDate,
  });

  const correctedReport = applyCorrectionsToReport(baseReport, correctionsDoc?.corrections);

  return correctedReport;
};
