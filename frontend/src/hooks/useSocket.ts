import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseSocketOptions {
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  autoConnect?: boolean;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('connecting');
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
      reconnectionAttempts: optionsRef.current.reconnectionAttempts || 5,
      reconnectionDelay: optionsRef.current.reconnectionDelay || 1000,
      autoConnect: optionsRef.current.autoConnect ?? true,
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
  }, []);

  return { socket, connectionStatus };
};
