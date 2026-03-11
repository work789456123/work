import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FarmersPage from './pages/FarmersPage';
import VeterinaryNetworkPage from './pages/VeterinaryNetworkPage';
import ConsultationsPage from './pages/ConsultationsPage';
import AnimalHealthPage from './pages/AnimalHealthPage';
import AIMonitoringPage from './pages/AIMonitoringPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/network" element={<VeterinaryNetworkPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/health" element={<AnimalHealthPage />} />
        <Route path="/monitoring" element={<AIMonitoringPage />} />
        <Route path="/kb" element={<KnowledgeBasePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Fallback for other routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
