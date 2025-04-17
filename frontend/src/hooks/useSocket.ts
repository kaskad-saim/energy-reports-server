import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseSocketOptions {
  url: string;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  autoConnect?: boolean;
}

export const useSocket = (options: UseSocketOptions) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('connecting');

  useEffect(() => {
    const socketInstance = io(options.url, {
      reconnectionAttempts: options.reconnectionAttempts || 5,
      reconnectionDelay: options.reconnectionDelay || 1000,
      autoConnect: options.autoConnect ?? true,
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    const handleConnect = () => {
      console.log('Подключено к серверу Socket.IO');
      setConnectionStatus('connected');
    };

    const handleDisconnect = () => {
      console.log('Отключено от сервера Socket.IO');
      setConnectionStatus('disconnected');
    };

    const handleConnectError = (error: Error) => {
      console.error('Ошибка подключения:', error);
      setConnectionStatus('error');
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);

    if (!socketInstance.connected) {
      socketInstance.connect();
    }

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
      socketInstance.disconnect();
    };
  }, [options.url]);

  return { socket, connectionStatus };
};