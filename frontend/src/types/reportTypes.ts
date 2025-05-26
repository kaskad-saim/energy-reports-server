export interface HourlyReportItem {
  [key: string]: number | string | null | undefined;
  hour: string;
}


export interface MonthlyReportItem {
  [key: string]: number | string | null | undefined;
  day: string;  // Формат: 'YYYY-MM-DD'
}

export interface CorrectionEntry {
  day: string;
  field: string;
  originalValue: number;
  correctedValue: number;
}

export type CorrectionsMap = Record<string, CorrectionEntry>;