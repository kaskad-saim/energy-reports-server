import { getAllDeviceData } from './dataStore.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Новое подключение:', socket.id);

    // Функция отправки текущих данных
    const sendData = () => {
      socket.emit('deviceData', getAllDeviceData());
    };

    // Отправляем данные сразу при подключении
    sendData();

    // Устанавливаем интервал для отправки каждые 5 секунд
    const intervalId = setInterval(sendData, 5000);

    // Обработка отключения клиента
    socket.on('disconnect', () => {
      clearInterval(intervalId);
      console.log('Клиент отключен:', socket.id);
    });
  });
};