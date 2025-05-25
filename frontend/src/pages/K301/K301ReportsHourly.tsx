import { useState } from 'react';
import styles from './K301ReportsHourly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';

const K301ReportsHourly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useHourlyReportByUrl(`/api/reports/k301-hourly?date=${dateParam}`);

  const columns = [
    {
      key: 'hour',
      label: 'Час',
      render: (item: HourlyReportItem) => {
        const time = item.hour;
        return time;
      },
    },
    { key: 'qt1Diff', label: 'QT1', unit: 'Гкал' },
    { key: 'wt1Avg', label: 'WT1', unit: 'Гкал/ч' },
    { key: 'qo1Avg', label: 'QO1', unit: 'м³/ч' },
    { key: 'qo2Avg', label: 'QO2', unit: 'м³/ч' },
    { key: 't1Avg', label: 'T1', unit: '°C' },
    { key: 't2Avg', label: 'T2', unit: '°C' },
    { key: 'p1Avg', label: 'P1', unit: 'МПа' },
    { key: 'p2Avg', label: 'P2', unit: 'МПа' },
    { key: 'qm1Avg', label: 'QM1', unit: 'т/ч' },
    { key: 'qm2Avg', label: 'QM2', unit: 'т/ч' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета K301"
        generatedAt={new Date().toLocaleString()}
        mode="single"
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        reportType="daily"
      />
    </div>
  );
};

export default K301ReportsHourly;
