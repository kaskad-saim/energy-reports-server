import { useState } from 'react';
import styles from './K295aK296aK295Reports.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';

const K295aK296aK295Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { data, loading, error } = useHourlyReportByUrl(`/api/reports/CC125-hourly?date=${dateParam}`);

  const columns = [
    {
      key: 'hour',
      label: 'Час',
      render: (item: HourlyReportItem) => {
        const date = new Date(item.hour);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
    },
    { key: 'k295a_du50_flowAvg', label: 'к295а питьевая ду50', unit: 'м³/ч' },
    { key: 'k295a_du50_accumulatedDiff', label: 'к295а питьевая ду50', unit: 'Гкал' },
    { key: 'k295_du32_flowAvg', label: 'к295 питьевая ду32', unit: 'м³/ч' },
    { key: 'k295_du32_accumulatedDiff', label: 'к295 питьевая ду32', unit: 'Гкал' },
    { key: 'k296a_du25_flowAvg', label: 'к296а речная ду25', unit: 'м³/ч' },
    { key: 'k296a_du25_accumulatedDiff', label: 'к296а речная ду25', unit: 'Гкал' },
    { key: 'k295a_du15_flowAvg', label: 'к295а питьевая ду15', unit: 'м³/ч' },
    { key: 'k295a_du15_accumulatedDiff', label: 'к295а питьевая ду15', unit: 'Гкал' },
  ];

  return (
    <div className={styles['reports-page']}>
      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="к295а/296а/295(вода речная, вода питьевая)"
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

export default K295aK296aK295Reports;
