// pages/K301ReportsMonthly.tsx

import { useState } from 'react';
import styles from './K301ReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReport } from '../../hooks/useMonthlyReport';
import BtnDefault from '../../ui/BtnDefault/BtnDefault';

const K301ReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const monthParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
    : '';
  const device = 'k301';

  // Используем обновлённый хук
  const {
    data,
    corrections,
    loading,
    error,
    pendingCorrections,
    updatePendingCorrection,
    saveAllCorrections,
    hasPending,
  } = useMonthlyReport(device, monthParam);

  const columns = [
    {
      key: 'day',
      label: 'Дата',
      render: (item: MonthlyReportItem) => {
        const date = new Date(item.day);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    { key: 'qt1Diff', label: 'QT1', unit: 'Гкал' },
    { key: 'wt1DaySum', label: 'WT1', unit: 'Гкал/ч' },
    { key: 'qo1DaySum', label: 'QO1', unit: 'м³/ч' },
    { key: 'qo2DaySum', label: 'QO2', unit: 'м³/ч' },
    { key: 't1DaySum', label: 'T1', unit: '°C' },
    { key: 't2DaySum', label: 'T2', unit: '°C' },
    { key: 'p1DaySum', label: 'P1', unit: 'МПа' },
    { key: 'p2DaySum', label: 'P2', unit: 'МПа' },
    { key: 'qm1DaySum', label: 'QM1', unit: 'т/ч' },
    { key: 'qm2DaySum', label: 'QM2', unit: 'т/ч' },
  ];

  const handleCorrectValue = (day: string, field: string, newValue: number) => {
    const originalEntry = data.find((item) => item.day === day);
    const originalValue = originalEntry?.[field as keyof typeof originalEntry];

    if (typeof originalValue === 'number') {
      updatePendingCorrection(day, field, originalValue, newValue);
    }
  };

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<MonthlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета K301 (месячный отчет)"
        generatedAt={new Date().toLocaleString()}
        mode="single"
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        reportType="monthly"
        isEditable={true}
        onCorrectValue={handleCorrectValue}
        corrections={{
          ...corrections,
          ...pendingCorrections,
        }}
      />

      {/* Кнопка сохранить коррекции */}
      {hasPending && (
        <BtnDefault
          className={styles['save-corrections-button']}
          onClick={saveAllCorrections}
        >
          Сохранить коррекции
        </BtnDefault>
      )}
    </div>
  );
};

export default K301ReportsMonthly;