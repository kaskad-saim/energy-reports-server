// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage/HomePage';
import K301Page from './pages/K301/K301Page';
import K301Charts from './pages/K301/K301Charts';
import K301Reports from './pages/K301/K301Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'k301', element: <K301Page /> },
      { path: 'k301/charts', element: <K301Charts /> },
      { path: 'k301/reports', element: <K301Reports /> },
      // Общие маршруты (если нужны)
      { path: 'charts', element: <K301Charts /> }, // или создайте общий ChartsPage
      { path: 'reports', element: <K301Reports /> }, // или создайте общий ReportsPage
    ],
  },
]);