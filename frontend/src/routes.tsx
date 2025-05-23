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
import UPcarbonizParReports from './pages/UPcarbonizPar/UPcarbonizParReports';
import MPA11Reports from './pages/MPA11/MPA11Reports';
import UPk10bParReports from './pages/UPk10bPar/UPk10bParReports';
import UPk10bParPage from './pages/UPk10bPar/UPk10bPar';
import K295aK296aK295Page from './pages/K295aK296aK295/K295aK296aK295Page';
import K295aK296aK295Reports from './pages/K295aK296aK295/K295aK296aK295Reports';
import K295Page from './pages/к295/K295Page';
import K295Reports from './pages/к295/K295Reports';

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
      { path: 'UPcarbonizPar/hourly-report', element: <UPcarbonizParReports /> },

      // МПА11
      { path: 'MPA11', element: <MPA11Page /> },
      { path: 'MPA11/hourly-report', element: <MPA11Reports /> },

      // УП 10б пар
      { path: 'UPk10bPar', element: <UPk10bParPage /> },
      { path: 'UPk10bPar/hourly-report', element: <UPk10bParReports /> },

      // к295а к296а к295
      { path: 'K295aK296aK295', element: <K295aK296aK295Page /> },
      { path: 'K295aK296aK295/hourly-report', element: <K295aK296aK295Reports /> },

      // к295
      { path: 'K295', element: <K295Page /> },
      { path: 'K295/hourly-report', element: <K295Reports /> },

    ],
  },
]);
