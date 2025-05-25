import { useState } from 'react';
import styles from './UPcarbonizParReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReportByUrl } from '../../hooks/useMonthlyReport';

const UPcarbonizParReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useMonthlyReportByUrl(`/api/reports/BB690-monthly?month=${dateParam}`);

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

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<MonthlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета карбонизация пар (месячный отчет)"
        generatedAt={new Date().toLocaleString()}
        mode="single"
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
  );
};

export default UPcarbonizParReportsMonthly;
