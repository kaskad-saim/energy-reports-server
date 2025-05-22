import { useState } from 'react';
import styles from './UPk10bParReports.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';

const UPk10bParReports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useHourlyReportByUrl(`/api/reports/BB551-hourly?date=${dateParam}`);

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
    { key: 'p1Avg', label: 'P1', unit: 'МПа' },
    { key: 'qo1Avg', label: 'QO1', unit: 'м³/ч' },
    { key: 'qm1Avg', label: 'QM1', unit: 'т/ч' },
    { key: 'wtAccumulatedDiff', label: 'вода техническая накопл. К10б', unit: 'Гкал' },
    { key: 'wpAccumulatedDiff', label: 'вода питьевая накопл. К9а', unit: 'Гкал' },
    { key: 'wtFlowAvg', label: 'вода техническая м3/ч К10б', unit: 'м³/ч' },
    { key: 'wpFlowAvg', label: '// вода питьевая м3/ч К9а', unit: 'м³/ч' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета УП 10б пар"
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

export default UPk10bParReports;
