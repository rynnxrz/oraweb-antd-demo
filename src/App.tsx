import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { MainLayout } from './layouts/MainLayout';
import ContractList from './pages/ContractList';
import Scheduling from './pages/Scheduling';
import Dashboard from './pages/Dashboard';
import { antdTheme } from './theme/antdTheme';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/contracts" replace />} />
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/schedule/:contractId" element={<Scheduling />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Dashboard />} /> {/* Placeholder */}
            <Route path="*" element={<Navigate to="/contracts" replace />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
