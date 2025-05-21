// src/pages/HomePage/HomePage.tsx
import  { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';
import { DeviceData } from '../../types/types';
import { useHourlyReportByUrl } from '../../hooks/useHourlyReport';
import { HourlyReportItem } from '../../types/reportTypes';
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';

const devices = [
  { id: 'k301', name: 'Узел учета K301' },
  { id: 'k302', name: 'Узел учета K302' },
  { id: 'UPcarbonizPar', name: 'УП карбонизация пар' },
  { id: 'MPA11', name: 'МПА11' },
];

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dateParam = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        selectedDate.getDate()
      ).padStart(2, '0')}`
    : '';

  const { socket, connectionStatus } = useSocket();

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
      label: 'Час',
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

  useEffect(() => {
    if (socket) {
      console.log('Статус соединения:', connectionStatus);

      const handleDeviceData = (data: DeviceData) => {
        console.log('Данные с сервера:', data);
      };

      socket.on('deviceData', handleDeviceData);

      return () => {
        socket.off('deviceData', handleDeviceData);
      };
    }
  }, [socket, connectionStatus]);

  return (
    <div className={styles['home-page']}>
      <h1 className={styles['home-page__title']}>Узлы учета энергоресурсов</h1>

      <div className={styles['devices-container']}>
        {devices.map((device) => (
          <div key={device.id} className={styles['device-card']}>
            <h2 className={styles['device-card__title']}>{device.name}</h2>
            <div className={styles['device-card__buttons']}>
              <Link to={`/${device.id}`} className={styles['device-card__button']}>
                Текущие параметры
              </Link>
              <Link to={`/${device.id}/charts`} className={styles['device-card__button']}>
                Графики
              </Link>
              <Link to={`/${device.id}/reports`} className={styles['device-card__button']}>
                Отчеты
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Таблица сравнения K301 и K302 по QT1 */}
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

export default HomePage;
