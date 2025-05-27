// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage/HomePage';
import K301Page from './pages/K301/K301Page';
import K301Charts from './pages/K301/K301Charts';
import K302Page from './pages/k302/K302Page';
import UPcarbonizParPage from './pages/UPcarbonizPar/UPcarbonizPar';
import MPA11Page from './pages/MPA11/MPA11';
import SizodSumHourReport from './pages/SizodSumHourReport/SizodSumHourReport';
import UPk10bParPage from './pages/UPk10bPar/UPk10bPar';
import K295aK296aK295Page from './pages/K295aK296aK295/K295aK296aK295Page';
import K295Page from './pages/к295/K295Page';
import K301ReportsHourly from './pages/K301/K301ReportsHourly';
import K301ReportsMonthly from './pages/K301/K301ReportsMonthly';
import K302ReportsMonthly from './pages/k302/K302ReportsMonthly';
import K302HourlyReports from './pages/k302/K302ReportsHourly';
import UPcarbonizParReportsHourly from './pages/UPcarbonizPar/UPcarbonizParReportsHourly';
import UPk10bParReportsHourly from './pages/UPk10bPar/UPk10bParReportsHourly';
import K295aK296aK295ReportsHourly from './pages/K295aK296aK295/K295aK296aK295ReportsHourly';
import MPA11ReportsHourly from './pages/MPA11/MPA11ReportsHourly';
// import MPA11ReportsMonthly from './pages/MPA11/MPA11ReportsMonthly';
// import K295aK296aK295ReportsMonthly from './pages/K295aK296aK295/K295aK296aK295ReportsMonthly';
// import UPcarbonizParReportsMonthly from './pages/UPcarbonizPar/UPcarbonizParReportsMonthly';
// import UPk10bParReportsMonthly from './pages/UPk10bPar/UPk10bParReportsMonthly';
import K295ReportsHourly from './pages/к295/K295ReportsHourly';
import SizodSumMonthReport from './pages/SizodSumMonthReport/SizodSumMonthReport';
// import K295ReportsMonthly from './pages/к295/K295ReportsMonthly';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      // K301
      { path: 'k301', element: <K301Page /> },
      { path: 'k301/charts', element: <K301Charts /> },
      { path: 'k301/hourly-report', element: <K301ReportsHourly /> },
      { path: 'k301/monthly-report', element: <K301ReportsMonthly /> },

      // K302
      { path: 'k302', element: <K302Page /> },
      { path: 'k302/hourly-report', element: <K302HourlyReports /> },
      { path: 'k302/monthly-report', element: <K302ReportsMonthly /> },


      // sizod sum hour report
      { path: 'sizod-sum-hour-report', element: <SizodSumHourReport /> },
      { path: 'sizod-sum-month-report', element: <SizodSumMonthReport /> },


      //  УП карбонизация пар
      { path: 'UPcarbonizPar', element: <UPcarbonizParPage /> },
      { path: 'UPcarbonizPar/hourly-report', element: <UPcarbonizParReportsHourly /> },
      // { path: 'UPcarbonizPar/monthly-report', element: <UPcarbonizParReportsMonthly /> },


      // МПА11
      { path: 'MPA11', element: <MPA11Page /> },
      { path: 'MPA11/hourly-report', element: <MPA11ReportsHourly /> },
      // { path: 'MPA11/monthly-report', element: <MPA11ReportsMonthly /> },

      // УП 10б пар
      { path: 'UPk10bPar', element: <UPk10bParPage /> },
      { path: 'UPk10bPar/hourly-report', element: <UPk10bParReportsHourly /> },
      // { path: 'UPk10bPar/monthly-report', element: <UPk10bParReportsMonthly /> },


      // к295а к296а к295
      { path: 'K295aK296aK295', element: <K295aK296aK295Page /> },
      { path: 'K295aK296aK295/hourly-report', element: <K295aK296aK295ReportsHourly /> },
      // { path: 'K295aK296aK295/monthly-report', element: <K295aK296aK295ReportsMonthly /> },

      // к295
      { path: 'K295', element: <K295Page /> },
      { path: 'K295/hourly-report', element: <K295ReportsHourly /> },
      // { path: 'K295/monthly-report', element: <K295ReportsMonthly /> },

    ],
  },
]);
