// src/pages/SizodSumHourReport/SizodSumHourReport.tsx
import { useState } from 'react';
import styles from '../../components/UniversalReportTable/UniversalReportTable.module.scss';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';

const SizodSumHourReport = () => {
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
  } = useHourlyReportByUrl(`/api/reports/k301-hourly?date=${dateParam}`);
  const {
    data: k302Data,
    loading: k302Loading,
    error: k302Error,
  } = useHourlyReportByUrl(`/api/reports/k302-hourly?date=${dateParam}`);

  const loading = k301Loading || k302Loading;
  const error = k301Error || k302Error;

  const multiData = {
    k301: k301Data,
    k302: k302Data,
  };

  const columns = [
    {
      key: 'hour',
      label: 'Время',
      render: (item: HourlyReportItem) => {
        const date = new Date(item.hour);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
    },
    { key: 'qt1Diff', label: 'QT1', unit: 'Гкал' },
  ];

  const multiConfig = {
    timeColumn: 'hour',
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
      <UniversalReportTable<HourlyReportItem>
        multiData={multiData}
        columns={columns}
        title="Сравнение параметра QT1 (Гкал)"
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

export default SizodSumHourReport;