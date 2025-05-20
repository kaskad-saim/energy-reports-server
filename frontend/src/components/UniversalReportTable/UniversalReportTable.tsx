// src/components/UniversalReportTable/UniversalReportTable.tsx
import React from 'react';
import styles from './UniversalReportTable.module.scss';
import Loader from '../../ui/loader/Loader';

export interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
  unit?: string;
  render?: (item: T) => React.ReactNode;
}

interface UniversalReportTableProps<T> {
  data?: T[];
  multiData?: Record<string, T[]>;
  columns: ColumnConfig<T>[];
  title?: string;
  generatedAt?: string;
  mode?: 'single' | 'multi-device';
  multiConfig?: {
    timeColumn: keyof T;
    devices: Array<{
      id: string;
      name: string;
      param: keyof T;
      columnConfig?: ColumnConfig<T>;
    }>;
  };
  loading?: boolean;
  error?: string | null;
}

const UniversalReportTable = <T extends Record<string, number | string | null | undefined>>({
  data,
  multiData,
  columns,
  title = 'Отчет',
  generatedAt,
  mode = 'single',
  multiConfig,
  loading = false,
  error = null,
}: UniversalReportTableProps<T>) => {
  const formatValue = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }
    return String(value);
  };

  if (loading) return <Loader />;
  if (error) return <p className={styles['universal-report-table__error']}>{error}</p>;
  if (!data?.length && !multiData)
    return <p className={styles['universal-report-table__no-data']}>Нет данных для отображения</p>;

  // Режим нескольких устройств
  if (mode === 'multi-device' && multiConfig && multiData) {
    const { timeColumn, devices } = multiConfig;

    // Берём временные метки из первого устройства
    const allHours =
      Object.values(multiData)
        .find((arr) => arr.length > 0)
        ?.map((d) => d[timeColumn]) || [];

    return (
      <div className={`${styles['universal-report-table']} ${styles['universal-report-table--multi-device']}`}>
        {title && <h2 className={styles['universal-report-table__title']}>{title}</h2>}
        {generatedAt && (
          <p className={styles['universal-report-table__generated-at']}>Отчет сформирован: {generatedAt}</p>
        )}
        <div className={styles['universal-report-table__table-container']}>
          <table>
            <thead>
              <tr>
                <th rowSpan={2} className={styles['universal-report-table__time-column']}>
                  {columns.find((c) => c.key === timeColumn)?.label || 'Время'}
                </th>
                {devices.map((device) => (
                  <th key={device.id} colSpan={1} className={styles['universal-report-table__device-header']}>
                    {device.name}
                  </th>
                ))}
              </tr>
              <tr>
                {devices.map((device) => {
                  const columnConfig = device.columnConfig || columns.find((c) => c.key === device.param);
                  return (
                    <th key={`${device.id}-param`} className={styles['universal-report-table__param-header']}>
                      {columnConfig?.label || String(device.param)}
                      {columnConfig?.unit ? ` (${columnConfig.unit})` : ''}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {allHours.map((hour, index) => (
                <tr key={index}>
                  <td className={styles['universal-report-table__time-cell']}>
                    {/* Безопасный рендер временного столбца */}
                    {(() => {
                      const timeColumnConfig = columns.find((c) => c.key === timeColumn);
                      if (!timeColumnConfig) return String(hour);

                      // Создаем временной объект с одним полем
                      const timeRow = { [timeColumn]: hour };

                      // Если есть render, вызываем его безопасно
                      return timeColumnConfig.render
                        ? timeColumnConfig.render(timeRow as unknown as T)
                        : formatValue(hour);
                    })()}
                  </td>
                  {devices.map((device) => {
                    const columnConfig = device.columnConfig || columns.find((c) => c.key === device.param);
                    const value = multiData[device.id]?.[index]?.[device.param];

                    return (
                      <td key={`${device.id}-${index}`}>
                        {(() => {
                          const rowData = multiData[device.id]?.[index];
                          if (!rowData) return formatValue(value);
                          return columnConfig?.render ? columnConfig.render(rowData) : formatValue(value);
                        })()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Режим одного устройства
  return (
    <div className={`${styles['universal-report-table']} ${styles['universal-report-table--single-device']}`}>
      {title && <h2 className={styles['universal-report-table__title']}>{title}</h2>}
      {generatedAt && (
        <p className={styles['universal-report-table__generated-at']}>Отчет сформирован: {generatedAt}</p>
      )}
      <div className={styles['universal-report-table__table-container']}>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)}>
                  {col.label}
                  {col.unit && ` (${col.unit})`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => {
                  const value = row[col.key as keyof T];
                  return <td key={String(col.key)}>{col.render ? col.render(row) : formatValue(value)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniversalReportTable;
