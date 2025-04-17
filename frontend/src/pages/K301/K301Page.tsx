import { useEffect, useState } from 'react';
import styles from './K301Page.module.scss';
import { useSocket } from '../../hooks/useSocket';
import { DeviceData } from '../../types/types';
import TableHeader from '../../components/Tableheader/TableHeader';

const K301Page = () => {
  const { socket, connectionStatus } = useSocket({
    url: 'http://localhost:3002',
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleDeviceData = (data: Record<string, DeviceData>) => {

      const k301Data = data['k301'];

      console.log(k301Data);

      if (k301Data) {
        setDeviceData(k301Data);
      }
    };

    socket.on('deviceData', handleDeviceData);

    return () => {
      socket.off('deviceData', handleDeviceData);
    };
  }, [socket]);

  return (
    <div className={styles['k301-page']}>
      <TableHeader title="Устройство k301" />
      <div className={styles['table-container']}>
        <h2 className={styles['table-title']}>Параметры устройства</h2>
        {connectionStatus === 'connected' && deviceData ? (
          <table className={styles['device-table']}>
            <thead>
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
                    <td>{value ?? 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>Ожидание данных от сервера...</p>
        )}
      </div>
    </div>
  );
};

export default K301Page