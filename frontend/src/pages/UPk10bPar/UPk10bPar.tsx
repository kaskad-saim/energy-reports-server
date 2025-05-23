import { useEffect, useState } from 'react';
import styles from './UPk10bPar.module.scss';
import { useSocket } from '../../hooks/useSocket';
import { DeviceData } from '../../types/types';
import TableHeader from '../../components/Tableheader/TableHeader';
import Loader from '../../ui/loader/Loader';

const UPk10bParPage = () => {
  const { socket, connectionStatus } = useSocket({
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleDeviceData = (data: Record<string, DeviceData>) => {
      const UPk10bParData = data['BB551'];
      console.log(UPk10bParData);

      if (UPk10bParData) {
        setDeviceData(UPk10bParData);
      }
    };

    socket.on('deviceData', handleDeviceData);

    return () => {
      socket.off('deviceData', handleDeviceData);
    };
  }, [socket]);

  return (
    <div className={styles['UPcarbonizPar-page']}>
      <TableHeader title="УП к10б пар" />
      <div className={styles['table-container']}>
        <h2 className={styles['table-title']}>Параметры устройства</h2>
        {connectionStatus === 'connected' && deviceData ? (
          <table className={styles['device-table']}>
            <thead>
              <tr>
                <th colSpan={2}>{deviceData.deviceName}</th>
              </tr>
              <tr>
                <th>Параметр</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(deviceData)
                .filter(([key]) => key !== 'deviceName' && key !== 'timestamp')
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value ?? 'NaN'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : connectionStatus === 'connecting' ? (
          <Loader />
        ) : connectionStatus === 'disconnected' ? (
          <p className={styles['error-message']}>Соединение с сервером потеряно. Попробуйте перезагрузить страницу.</p>
        ) : connectionStatus === 'error' ? (
          <p className={styles['error-message']}>Ошибка подключения к серверу. Проверьте настройки соединения.</p>
        ) : null}
      </div>
    </div>
  );
};

export default UPk10bParPage;
