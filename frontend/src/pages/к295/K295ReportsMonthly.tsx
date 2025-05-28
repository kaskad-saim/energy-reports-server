import { useState, useMemo } from 'react';
import styles from './K295ReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReport } from '../../hooks/useMonthlyReport';
import { applyCorrectionsToData } from '../../utils/applyCorrectionsToData';

const K295ReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = useMemo(() => {
    return selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}` : '';
  }, [selectedDate]);

  const device = 'CC168'; // Устройство

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
    { key: 'k295_du20_accumulatedDiff', label: 'к295 питьевая ду20', unit: 'Гкал' },
    { key: 'k295_du50_accumulatedDiff', label: 'к295 питьевая ду50', unit: 'Гкал' },
  ];

  const handleCorrectValue = (day: string, field: string, newValue: number) => {
    const originalEntry = data.find((item) => item.day === day);
    const originalValue = originalEntry?.[field as keyof typeof originalEntry];
    if (typeof originalValue === 'number') {
      updatePendingCorrection(day, field, originalValue, newValue);
    }
  };

  const memoizedData = useMemo(() => {
    return applyCorrectionsToData(data, corrections);
  }, [data, corrections]);

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<MonthlyReportItem>
        key={dateParam}
        data={memoizedData}
        columns={columns}
        title="Параметры узла учета к295 (вода питьевая) (месячный отчет)"
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
        hasPendingCorrections={hasPending}
        onSaveCorrections={saveAllCorrections}
      />
    </div>
  );
};

export default K295ReportsMonthly;
