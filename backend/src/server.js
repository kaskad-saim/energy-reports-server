import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from './services/socket.js';
import { pollDevicesWithSharedConnection } from './services/globalClient.js';
import { connectDB } from './services/dataBase.js';
import dotenv from 'dotenv';
import { comPortManager } from './services/modbus/comPortManager.js';
import reportRoutes from './routes/reportRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { scheduleMonthlyReports } from './services/monthlyReportScheduler.js';

// Загружаем переменные окружения
dotenv.config();

if (!process.env.NODE_ENV) {
  console.warn('NODE_ENV не установлен, используется development');
  process.env.NODE_ENV = 'development';
}

// Проверка загрузки переменных
console.log('Env loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
});


// Получаем __dirname в ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Подключение к MongoDB
connectDB();

// Инициализация Socket.IO
const server = createServer(app);
const io = new Server(server);
initSocket(io);


scheduleMonthlyReports(); // запускаем фоновую генерацию отчетов

// маршруты
app.use('/api/reports', reportRoutes);



// Раздача статики из папки frontend (например, после билда)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Роут для SPA — перенаправление всех запросов на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV}`);

  // Явно инициализируем перед запуском опроса
  await comPortManager.initialize();
  pollDevicesWithSharedConnection();
});
