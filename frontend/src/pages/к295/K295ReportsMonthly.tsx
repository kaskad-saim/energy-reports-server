import { useState } from 'react';
import styles from './K295ReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';

import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReportByUrl } from '../../hooks/useMonthlyReport';

const K295ReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useMonthlyReportByUrl(`/api/reports/CC168-monthly?month=${dateParam}`);

  console.log(data);


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

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<MonthlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета к295(вода питьевая) (месячный отчет)"
        generatedAt={new Date().toLocaleString()}
        mode="single"
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        reportType="monthly"
      />
    </div>
  );
};

export default K295ReportsMonthly;
