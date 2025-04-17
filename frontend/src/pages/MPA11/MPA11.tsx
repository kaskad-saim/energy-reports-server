// src/pages/K302/K302Page.tsx
import { useEffect, useState } from 'react';
import styles from './MPA11.module.scss';
import { useSocket } from '../../hooks/useSocket';
import { DeviceData } from '../../types/types';
import TableHeader from '../../components/Tableheader/TableHeader';
import Loader from '../../ui/loader/Loader';

const MPA11Page = () => {
  const { socket, connectionStatus } = useSocket({
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleDeviceData = (data: Record<string, DeviceData>) => {
      const MPA11Data = data['BB93'];
      console.log(MPA11Data);

      if (MPA11Data) {
        setDeviceData(MPA11Data);
      }
    };

    socket.on('deviceData', handleDeviceData);

    return () => {
      socket.off('deviceData', handleDeviceData);
    };
  }, [socket]);

  return (
    <div className={styles['MPA11-page']}>
      <TableHeader title='МПА11' />
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
                    <td>{value ?? 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default MPA11Page;
