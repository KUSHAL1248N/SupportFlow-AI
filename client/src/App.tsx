import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Shell from './components/Shell';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import { useAuth } from './store/auth';
function Guard() { const { user } = useAuth(); return user ? <Shell brand="SupportFlow AI" initials="SF" /> : <Navigate to="/login" replace />; }
export default function App() {
  const { hydrate, ready, user } = useAuth();
  useEffect(() => { void hydrate(); }, [hydrate]);
  if (!ready) return <div className="loading-screen">Loading SupportFlow AI…</div>;
  return <Routes>
    <Route path="/login" element={<AuthPage appName="SupportFlow AI" tagline="Better support starts with a clearer picture." />} />
    <Route element={<Guard />}>
      <Route path="/" element={<DashboardPage appName="SupportFlow AI" />} />
      <Route path="/tickets" element={<TicketsPage />} />
    </Route>
    <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
  </Routes>;
}
