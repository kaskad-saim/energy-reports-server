import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from './services/socket.js';
import { pollDevicesWithSharedConnection } from './services/globalClient.js';
import { connectDB } from './services/dataBase.js';
import dotenv from 'dotenv';
import { comPortManager } from './services/modbus/comPortManager.js';

// Загружаем переменные окружения
dotenv.config();

if (!process.env.NODE_ENV) {
  console.warn('NODE_ENV не установлен, используется development');
  process.env.NODE_ENV = 'development';
}

// Проверка загрузки переменных
console.log('Env loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

// Отладочные сообщения
console.log('Initial NODE_ENV:', process.env.NODE_ENV);
console.log('Initial PORT:', process.env.PORT);

const app = express();
app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server);

// Подключение к MongoDB
connectDB();

// Инициализация Socket.IO
initSocket(io);

// Запускаем сервер
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV}`);

  // Явно инициализируем перед запуском опроса
  await comPortManager.initialize();
  pollDevicesWithSharedConnection();
});
