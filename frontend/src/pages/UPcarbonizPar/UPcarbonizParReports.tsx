import { useState } from 'react';
import styles from './UPcarbonizParReports.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';

const UPcarbonizParReports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useHourlyReportByUrl(`/api/reports/BB690-hourly?date=${dateParam}`);

  const columns = [
    {
      key: 'hour',
      label: 'Час',
      render: (item: HourlyReportItem) => {
        const date = new Date(item.hour);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
    },
    { key: 'wt1Avg', label: 'WT1', unit: 'Гкал/ч' },
    { key: 't1Avg', label: 'T1', unit: '°C' },
    { key: 'p1Avg', label: 'P1', unit: 'МПа' },
    { key: 'qo1Avg', label: 'QO1', unit: 'м³/ч' },
    { key: 'qm1Avg', label: 'QM1', unit: 'т/ч' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета карбонизация пар"
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

export default UPcarbonizParReports;
