import { useState } from 'react';
import styles from './UPk10bParReportsMonthly.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';

import { MonthlyReportItem } from '../../types/reportTypes';
import { useMonthlyReportByUrl } from '../../hooks/useMonthlyReport';

const UPk10bParReportsMonthly = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useMonthlyReportByUrl(`/api/reports/BB551-monthly?month=${dateParam}`);

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
   { key: 'wt1DaySum', label: 'WT1', unit: 'Гкал/ч' },
    { key: 'p1DaySum', label: 'P1', unit: 'МПа' },
    { key: 'qo1DaySum', label: 'QO1', unit: 'м³/ч' },
    { key: 'qm1DaySum', label: 'QM1', unit: 'т/ч' },
    { key: 'wtAccumulatedDiff', label: 'вода техническая накопл. К10б', unit: 'Гкал' },
    { key: 'wpAccumulatedDiff', label: 'вода питьевая накопл. К9а', unit: 'Гкал' },
    { key: 'wtFlowDaySum', label: 'вода техническая м3/ч К10б', unit: 'м³/ч' },
    { key: 'wpFlowDaySum', label: '// вода питьевая м3/ч К9а', unit: 'м³/ч' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<MonthlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла УП 10б пар (месячный отчет)"
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

export default UPk10bParReportsMonthly;
