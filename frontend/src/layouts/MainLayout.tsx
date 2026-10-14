import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';
import { ROUTES } from '@/routes/routes';

export function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to={ROUTES.HOME}>Task Manager</NavLink>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {isAuthenticated ? (
              <>
                <NavLink className="nav-link" to={ROUTES.DASHBOARD}>Dashboard</NavLink>
                <NavLink className="nav-link" to={ROUTES.TASKS}>Tasks</NavLink>
                <span className="navbar-text">{user?.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to={ROUTES.AUTH.LOGIN}>Log in</NavLink>
                <NavLink className="btn btn-primary btn-sm" to={ROUTES.AUTH.REGISTER}>Register</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container py-4"><Outlet /></main>
    </>
  );
}
