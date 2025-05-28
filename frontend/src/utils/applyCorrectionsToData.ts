import {  CorrectionsMap, MonthlyReportItem } from "../types/reportTypes";


export const applyCorrectionsToData = (
  data: MonthlyReportItem[],
  corrections: CorrectionsMap
): MonthlyReportItem[] => {
  if (!data.length || !Object.keys(corrections).length) return data;

  return data.map((item) => {
    const correctionsForDay = Object.values(corrections).filter((corr) => corr.day === item.day);

    if (!correctionsForDay.length) return item;

    return correctionsForDay.reduce((acc, correction) => {
      acc[correction.field] = correction.correctedValue;
      return acc;
    }, { ...item });
  });
};