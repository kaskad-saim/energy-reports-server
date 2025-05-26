// reports/k302MonthlyReport.js

import correctionModel from '../models/correctionModel.js';
import k302model from '../models/k302Model.js';
import { generateDailyReport } from '../utils/reportDailyUtils.js';
import { applyCorrectionsToReport } from '../utils/applyCorrections.js';

export const getMonthlyK302Report = async (selectedMonth) => {
  const baseReport = await generateDailyReport(
    k302model,
    {
      averageFields: ['wt1', 'qo1', 'qo2', 't1', 't2', 'p1', 'p2', 'qm1', 'qm2'],
      deltaFields: ['qt1'],
    },
    selectedMonth
  );

  const correctionsDoc = await correctionModel.findOne({
    device: 'k302',
    month: selectedMonth,
  });

  const correctedReport = applyCorrectionsToReport(
    baseReport,
    correctionsDoc?.corrections
  );

  return correctedReport;
};