// components/UniversalReportTable/UniversalReportTable.tsx
import React, { useState } from 'react';
import styles from './UniversalReportTable.module.scss';
import Loader from '../../ui/loader/Loader';
import 'react-datepicker/dist/react-datepicker.css';
import StyledDatePicker from '../../ui/StyledDatePicker/StyledDatePicker';
import { calculateTotals } from '../../utils/calculateTotals';
import { CorrectionsMap } from '../../types/reportTypes';
import BtnDefault from '../../ui/BtnDefault/BtnDefault';
import PasswordModal from '../PasswordModal/PasswordModal';

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
  selectedDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
  reportType?: 'daily' | 'monthly';
  isEditable?: boolean;
  onCorrectValue?: (day: string, field: string, newValue: number) => void;
  corrections?: CorrectionsMap;
  hasPendingCorrections?: boolean;
  onSaveCorrections?: () => void;
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
  selectedDate,
  onDateChange,
  reportType = 'daily',
  isEditable = false,
  onCorrectValue,
  corrections = {},
  hasPendingCorrections = false,
  onSaveCorrections,
}: UniversalReportTableProps<T>) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const totals = React.useMemo(() => {
    return calculateTotals<T>({
      mode,
      data,
      multiData,
      columns,
      multiConfig,
    });
  }, [mode, data, multiData, columns, multiConfig]);

  const handleSaveClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handleConfirm = () => {
    onSaveCorrections?.();
    setIsPasswordModalOpen(false);
  };

  if (loading) return <Loader />;
  if (error) return <p className={styles['universal-report-table__error']}>{error}</p>;

  const formatValue = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }
    return String(value);
  };

  const hasData =
    mode === 'multi-device'
      ? multiData && Object.values(multiData).some((arr) => arr.length > 0)
      : (data ?? []).length > 0;

  const hasTotals = Object.keys(totals).length > 0;

  const handleCellChange = (row: T, colKey: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = row['day'];
    if (typeof day !== 'string' || !day.startsWith('20')) {
      console.warn('Неверный формат даты в строке', row);
      return;
    }

    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onCorrectValue?.(day, colKey, newValue);
    }
  };

  return (
    <div className={`${styles['universal-report-table']} ${styles['universal-report-table--with-calendar']}`}>
      {/* Заголовок и календарь */}
      <div className={styles['universal-report-table__header']}>
        <div className={styles['universal-report-table__header-left']}>
          {title && <h2 className={`${styles['universal-report-table__title']} title-reset`}>{title}</h2>}
          {generatedAt && <p>Отчет сформирован: {generatedAt}</p>}
        </div>
        {onDateChange && (
          <div className={styles['universal-report-table__header-right']}>
            <span>Выберите период</span>
            <StyledDatePicker
              selected={selectedDate}
              onChange={onDateChange}
              placeholderText="Выберите дату"
              mode={reportType}
            />
          </div>
        )}
      </div>

      {/* Таблица */}
      <div className={styles['universal-report-table__table-container']}>
        {mode === 'multi-device' && multiConfig && multiData ? (
          <table>
            <thead>
              <tr>
                <th rowSpan={2} className={styles['universal-report-table__time-column']}>
                  {columns.find((c) => c.key === multiConfig.timeColumn)?.label || 'Время'}
                </th>
                {multiConfig.devices.map((device) => (
                  <th key={device.id} colSpan={1} className={styles['universal-report-table__device-header']}>
                    {device.name}
                  </th>
                ))}
              </tr>
              <tr>
                {multiConfig.devices.map((device) => {
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
              {hasData ? (
                Object.values(multiData)
                  .find((arr) => arr.length > 0)
                  ?.map((_, index) => (
                    <tr key={index}>
                      {multiConfig.devices.map((device, i) => {
                        const rowData = multiData[device.id]?.[index];
                        const columnConfig = device.columnConfig || columns.find((c) => c.key === device.param);
                        const value = rowData ? rowData[device.param] : null;
                        if (i === 0 && rowData) {
                          const timeValue = rowData[multiConfig.timeColumn];
                          return (
                            <React.Fragment key={device.id}>
                              <td className={styles['universal-report-table__time-cell']}>
                                {columnConfig?.render ? columnConfig.render(rowData) : formatValue(timeValue)}
                              </td>
                              <td>{columnConfig?.render ? columnConfig.render(rowData) : formatValue(value)}</td>
                            </React.Fragment>
                          );
                        }
                        if (rowData) {
                          return (
                            <td key={device.id}>
                              {columnConfig?.render ? columnConfig.render(rowData) : formatValue(value)}
                            </td>
                          );
                        }
                        return <td key={device.id}>-</td>;
                      })}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={multiConfig.devices.length + 1}
                    className={styles['universal-report-table__no-data-row']}
                  >
                    Нет данных для отображения
                  </td>
                </tr>
              )}

              {/* Строка Итого */}
              {hasTotals && (
                <tr className={styles['universal-report-table__total-row']}>
                  <td className={`${styles['universal-report-table__total-label']}`}>Итого</td>
                  {multiConfig.devices.map((device) => {
                    const keyStr = device.param as string;
                    const totalValue = totals[`${device.id}-${keyStr}`];
                    return (
                      <td
                        key={`total-${device.id}-${keyStr}`}
                        className={styles['universal-report-table__total-label']}
                      >
                        {typeof totalValue === 'number' ? totalValue.toFixed(2) : '-'}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        ) : (
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
              {(data || []).length > 0 ? (
                (data || []).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col) => {
                      const keyStr = col.key as string;
                      const value = row[keyStr];
                      const isCorrected = corrections[`${row.day}-${keyStr}`];
                      const isNumber = typeof value === 'number';
                      const isEditableCell = isEditable && reportType === 'monthly' && isNumber;

                      return (
                        <td
                          key={String(col.key)}
                          style={{
                            backgroundColor: isCorrected ? '#fff3cd' : 'inherit',
                            fontWeight: isCorrected ? 'bold' : 'normal',
                          }}
                        >
                          {isEditableCell ? (
                            <input
                              type="number"
                              step="0.01"
                              defaultValue={value}
                              onBlur={handleCellChange(row, keyStr)}
                              className={styles['editable-cell-input']}
                            />
                          ) : col.render ? (
                            col.render(row)
                          ) : (
                            formatValue(value)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles['universal-report-table__no-data-row']}>
                    Нет данных для отображения
                  </td>
                </tr>
              )}

              {/* Строка Итого */}
              {hasTotals && (
                <tr className={styles['universal-report-table__total-row']}>
                  <td className={styles['universal-report-table__total-label']}>Итого</td>
                  {columns.slice(1).map((col) => {
                    const keyStr = col.key as string;
                    const totalValue = totals[keyStr];
                    return (
                      <td key={`total-${String(col.key)}`} className={styles['universal-report-table__total-label']}>
                        {typeof totalValue === 'number' ? totalValue.toFixed(2) : '-'}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Кнопка сохранить коррекции */}
      {onSaveCorrections && (
        <div className={styles['universal-report-table__save-button-container']}>
          <BtnDefault onClick={handleSaveClick} disabled={!hasPendingCorrections}>
            Сохранить коррекции
          </BtnDefault>
        </div>
      )}

      {/* Модальное окно для ввода пароля */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default UniversalReportTable;
