import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';

export function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container py-5" role="status">Restoring session…</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace state={{ from: location }} />;
  return <Outlet />;
}
