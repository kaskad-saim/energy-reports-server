// src/pages/HomePage/HomePage.tsx
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';
import { DeviceData } from '../../types/types';

const devices = [
  {
    id: 'k301',
    name: 'Узел учета K301',
  },
  {
    id: 'k302',
    name: 'Узел учета K302',
  },
  {
    id: 'UPcarbonizPar',
    name: 'УП карбонизация пар',
  },
  {
    id: 'MPA11',
    name: 'МПА11',
  },
];

const HomePage = () => {
  const { socket, connectionStatus } = useSocket();

  useEffect(() => {
    if (socket) {
      console.log('Статус соединения:', connectionStatus);

      // Подписываемся на событие 'deviceData', которое отправляет сервер
      const handleDeviceData = (data: DeviceData) => {
        console.log('Данные с сервера:', data);
      };

      socket.on('deviceData', handleDeviceData);

      // Отписываемся от события при размонтировании компонента
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
    </div>
  );
};

export default HomePage;
