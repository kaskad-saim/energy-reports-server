import { useState } from 'react';
import styles from './K295aK296aK295ReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';

import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReportByUrl } from '../../hooks/useMonthlyReport';

const K295aK296aK295ReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useMonthlyReportByUrl(`/api/reports/CC125-monthly?month=${dateParam}`);

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
    { key: 'k295a_du50_flowDaySum', label: 'к295а питьевая ду50', unit: 'м³/ч' },
    { key: 'k295a_du50_accumulatedDiff', label: 'к295а питьевая ду50', unit: 'Гкал' },
    { key: 'k295_du32_flowDaySum', label: 'к295 питьевая ду32', unit: 'м³/ч' },
    { key: 'k295_du32_accumulatedDiff', label: 'к295 питьевая ду32', unit: 'Гкал' },
    { key: 'k296a_du25_flowDaySum', label: 'к296а речная ду25', unit: 'м³/ч' },
    { key: 'k296a_du25_accumulatedDiff', label: 'к296а речная ду25', unit: 'Гкал' },
    { key: 'k295a_du15_flowDaySum', label: 'к295а питьевая ду15', unit: 'м³/ч' },
    { key: 'k295a_du15_accumulatedDiff', label: 'к295а питьевая ду15', unit: 'Гкал' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<MonthlyReportItem>
        data={data}
        columns={columns}
        title="к295а/296а/295(вода речная, вода питьевая) (месячный отчет)"
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

export default K295aK296aK295ReportsMonthly;
