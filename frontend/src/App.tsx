import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ChartsPage from './pages/ChartsPage';
import ReportsPage from './pages/ReportsPage';
import K301Page from './pages/K301/K301Page';


function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/k301" element={<K301Page />} />
      </Routes>
    </div>
  );
}

export default App;
