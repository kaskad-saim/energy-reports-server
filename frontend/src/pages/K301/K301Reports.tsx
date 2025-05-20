import styles from './K301Reports.module.scss';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';

const K301Reports = () => {
  const { data, loading, error } = useHourlyReportByUrl('http://localhost:3002/api/reports/k301-hourly');

  console.log(data);


  const columns = [
    {
      key: 'hour',
      label: 'Час',
      render: (item: HourlyReportItem) => {
        const date = new Date(item.hour);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <h1>Суточный отчет по K301</h1>

      <UniversalReportTable<HourlyReportItem>
        data={data}
        columns={columns}
        title="Параметры узла учета K301"
        generatedAt={new Date().toLocaleString()}
        mode="single"
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default K301Reports;