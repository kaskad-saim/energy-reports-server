import { ColumnConfig } from '../components/UniversalReportTable/UniversalReportTable';

export interface Totals {
  [key: string]: number;
}

export interface DeviceTotals {
  [key: string]: number;
}

interface CalculateTotalsParams<T> {
  mode?: 'single' | 'multi-device';
  data?: T[];
  multiData?: Record<string, T[]>;
  columns?: ColumnConfig<T>[];
  multiConfig?: {
    timeColumn: keyof T;
    devices: Array<{
      id: string;
      name: string;
      param: keyof T;
      columnConfig?: ColumnConfig<T>;
    }>;
  };
}

export const calculateTotals = <T extends Record<string, number | string | null | undefined>>({
  mode = 'single',
  data,
  multiData,
  columns = [],
  multiConfig,
}: CalculateTotalsParams<T>): Totals => {
  const totals: Totals = {};

  if (mode === 'single' && data && columns.length > 0) {
    columns.forEach((col) => {
      const keyStr = col.key as string;

      const isNumeric = data.every((row) => {
        const rawValue = row[keyStr];
        const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
        return !isNaN(value);
      });

      if (isNumeric) {
        totals[keyStr] = data.reduce((sum, row) => {
          const rawValue = row[keyStr];
          const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      }
    });
  }

  if (mode === 'multi-device' && multiConfig && multiData && columns.length > 0) {
    multiConfig.devices.forEach((device) => {
      const keyStr = device.param as string;

      // Берём только данные текущего устройства
      const deviceData = multiData[device.id] || [];

      const allValuesAreNumeric = deviceData.every((row) => {
        if (!row) return true;
        const rawValue = row[keyStr];
        const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
        return !isNaN(value);
      });

      if (allValuesAreNumeric) {
        const total = deviceData.reduce((sum, row) => {
          if (!row) return sum;
          const rawValue = row[keyStr];
          const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);

        totals[`${device.id}-${keyStr}`] = parseFloat(total.toFixed(2));
      }
    });
  }

  return totals;
};