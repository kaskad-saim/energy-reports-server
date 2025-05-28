import { useState } from 'react';
import styles from './MPA11ReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReport } from '../../hooks/useMonthlyReport';

const MPA11ReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
    : '';

  const device = 'BB93'; // Устройство, для которого загружаем данные

  const {
    data,
    corrections,
    pendingCorrections,
    loading,
    error,
    updatePendingCorrection,
    saveAllCorrections,
    hasPending,
  } = useMonthlyReport(device, dateParam);

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
    { key: 'wt1DaySum', label: 'WT1', unit: 'Гкал/ч' },
    { key: 't1DaySum', label: 'T1', unit: '°C' },
    { key: 'p1DaySum', label: 'P1', unit: 'МПа' },
    { key: 'qo1DaySum', label: 'QO1', unit: 'м³/ч' },
    { key: 'qm1DaySum', label: 'QM1', unit: 'т/ч' },
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
        key={dateParam} // Обязательно для перерендера при смене месяца
        data={data}
        columns={columns}
        title="Параметры узла учета МПА11 (месячный отчет)"
        generatedAt={new Date().toLocaleString()}
        mode="single"
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        reportType="monthly"
        isEditable={true} // Включаем возможность редактирования
        onCorrectValue={handleCorrectValue}
        corrections={{
          ...corrections,
          ...pendingCorrections,
        }}
        hasPendingCorrections={hasPending}
        onSaveCorrections={saveAllCorrections}
      />
    </div>
  );
};

export default MPA11ReportsMonthly;