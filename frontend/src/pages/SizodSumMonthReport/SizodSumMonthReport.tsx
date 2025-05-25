// src/pages/SizodSumHourReport/SizodSumHourReport.tsx
import { useState } from 'react';
import styles from '../../components/UniversalReportTable/UniversalReportTable.module.scss';
import { MonthlyReportItem } from '../../types/reportTypes';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useMonthlyReportByUrl } from '../../hooks/useMonthlyReport';

const SizodSumMonthReport = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const {
    data: k301Data,
    loading: k301Loading,
    error: k301Error,
  } = useMonthlyReportByUrl(`/api/reports/k301-monthly?month=${dateParam}`);
  const {
    data: k302Data,
    loading: k302Loading,
    error: k302Error,
  } = useMonthlyReportByUrl(`/api/reports/k302-monthly?month=${dateParam}`);

  const loading = k301Loading || k302Loading;
  const error = k301Error || k302Error;

  const multiData = {
    k301: k301Data,
    k302: k302Data,
  };

  console.log(multiData.k301);


  const columns = [
    {
      key: 'daу',
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
    { key: 'qt1Diff', label: 'QT1', unit: 'Гкал' },
  ];

  const multiConfig = {
    timeColumn: 'day',
    devices: [
      {
        id: 'k301',
        name: 'K301',
        param: 'qt1Diff',
        columnConfig: columns.find((col) => col.key === 'qt1Diff'),
      },
      {
        id: 'k302',
        name: 'K302',
        param: 'qt1Diff',
        columnConfig: columns.find((col) => col.key === 'qt1Diff'),
      },
    ],
  };

  return (
    <div className={styles['report-container']}>
      <UniversalReportTable<MonthlyReportItem>
        multiData={multiData}
        columns={columns}
        title="Сравнение параметра QT1 (Гкал) (месячный отчет)"
        generatedAt={new Date().toLocaleString()}
        mode="multi-device"
        multiConfig={multiConfig}
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
  );
};

export default SizodSumMonthReport;
