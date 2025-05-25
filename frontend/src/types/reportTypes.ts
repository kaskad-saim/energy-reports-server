export interface HourlyReportItem {
  [key: string]: number | string | null | undefined;
  hour: string;
}


export interface MonthlyReportItem {
  [key: string]: number | string | null | undefined;
  day: string;  // Формат: 'YYYY-MM-DD'
}