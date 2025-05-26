// utils/applyCorrections.js
export function applyCorrectionsToReport(reportData, corrections) {
  if (!corrections || !reportData) return reportData;

  return reportData.map((entry) => {
    const day = entry.day;
    const correctionsForDay = Object.values(corrections).filter(
      (correction) => correction.day === day
    );

    correctionsForDay.forEach((correction) => {
      // Применяем только если поле заканчивается на Diff или DaySum
      if (
        correction.field.endsWith('Diff') ||
        correction.field.endsWith('DaySum')
      ) {
        entry[correction.field] = correction.correctedValue;
      }
    });

    return entry;
  });
}