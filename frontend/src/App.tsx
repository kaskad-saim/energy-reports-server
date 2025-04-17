// src/App.tsx
import { Outlet } from 'react-router-dom';
import './styles/index.scss';

function App() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}

export default App;