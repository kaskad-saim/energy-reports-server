import { useState, useMemo } from 'react';
import styles from './K295aK296aK295ReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReport } from '../../hooks/useMonthlyReport';
import { applyCorrectionsToData } from '../../utils/applyCorrectionsToData';

const K295aK296aK295ReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = useMemo(() => {
    return selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}` : '';
  }, [selectedDate]);

  const device = 'CC125'; // ID устройства

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
    { key: 'k295a_du50_flowDaySum', label: 'к295а питьевая ду50', unit: 'м³/ч' },
    { key: 'k295a_du50_accumulatedDiff', label: 'к295а питьевая ду50', unit: 'Гкал' },
    { key: 'k295_du32_flowDaySum', label: 'к295 питьевая ду32', unit: 'м³/ч' },
    { key: 'k295_du32_accumulatedDiff', label: 'к295 питьевая ду32', unit: 'Гкал' },
    { key: 'k296a_du25_flowDaySum', label: 'к296а речная ду25', unit: 'м³/ч' },
    { key: 'k296a_du25_accumulatedDiff', label: 'к296а речная ду25', unit: 'Гкал' },
    { key: 'k295a_du15_flowDaySum', label: 'к295а питьевая ду15', unit: 'м³/ч' },
    { key: 'k295a_du15_accumulatedDiff', label: 'к295а питьевая ду15', unit: 'Гкал' },
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
        title="к295а/296а/295 (вода речная, вода питьевая) (месячный отчет)"
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

export default K295aK296aK295ReportsMonthly;
