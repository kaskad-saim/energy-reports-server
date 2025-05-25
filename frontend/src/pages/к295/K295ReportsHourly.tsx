import { useState } from 'react';
import styles from './K295ReportsHourly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';

const K295ReportsHourly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useHourlyReportByUrl(`/api/reports/CC168-hourly?date=${dateParam}`);

  const columns = [
    {
      key: 'hour',
      label: 'Час',
      render: (item: HourlyReportItem) => {
        const time = item.hour;
        return time;
      },
    },
    { key: 'k295_du20_accumulatedDiff', label: 'к295 питьевая ду20', unit: 'Гкал' },
    { key: 'k295_du50_accumulatedDiff', label: 'к295 питьевая ду50', unit: 'Гкал' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="к295(вода питьевая)"
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

export default K295ReportsHourly;
