import styles from './K302Reports.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';
import Loader from '../../ui/loader/Loader';
import { useState } from 'react';

const K302Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useHourlyReportByUrl(`/api/reports/k302-hourly?date=${dateParam}`);


  if (loading) return <Loader />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const columns = [
    {
      key: 'hour',
      label: 'Час',
      render: (item: HourlyReportItem) => {
        const date = new Date(item.hour);
        return date.toTimeString().slice(0, 5); // "HH:MM"
      },
    },
    { key: 'qt1Diff', label: 'QT1 (Гкал)' },
    { key: 'wt1Avg', label: 'WT1 (Гкал/ч)' },
    { key: 'qo1Avg', label: 'QO1 (м³/ч)' },
    { key: 'qo2Avg', label: 'QO2 (м³/ч)' },
    { key: 't1Avg', label: 'T1 (°C)' },
    { key: 't2Avg', label: 'T2 (°C)' },
    { key: 'p1Avg', label: 'P1 (МПа)' },
    { key: 'p2Avg', label: 'P2 (МПа)' },
    { key: 'qm1Avg', label: 'QM1 (т/ч)' },
    { key: 'qm2Avg', label: 'QM2 (т/ч)' },
  ];

  return (
    <div className={styles['reports-page']}>
      <h1>Суточный отчет по K302</h1>

      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета K302"
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

export default K302Reports;
