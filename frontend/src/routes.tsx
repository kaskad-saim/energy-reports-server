// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage/HomePage';
import K301Page from './pages/K301/K301Page';
import K301Charts from './pages/K301/K301Charts';
import K301Reports from './pages/K301/K301Reports';
import K302Page from './pages/k302/K302Page';
import UPcarbonizParPage from './pages/UPcarbonizPar/UPcarbonizPar';
import MPA11Page from './pages/MPA11/MPA11';
import K302Reports from './pages/k302/K302Reports';
import SizodSumHourReport from './pages/SizodSumHourReport/SizodSumHourReport';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      // K301
      { path: 'k301', element: <K301Page /> },
      { path: 'k301/charts', element: <K301Charts /> },
      { path: 'k301/hourly-report', element: <K301Reports /> },
      // K302
      { path: 'k302', element: <K302Page /> },
      { path: 'k302/hourly-report', element: <K302Reports /> },
      // sizod sum hour report
      { path: 'sizod-sum-hour-report', element: <SizodSumHourReport /> },

      //  УП карбонизация пар
      { path: 'UPcarbonizPar', element: <UPcarbonizParPage /> },

      // МПА11
      { path: 'MPA11', element: <MPA11Page /> },
    ],
  },
]);
