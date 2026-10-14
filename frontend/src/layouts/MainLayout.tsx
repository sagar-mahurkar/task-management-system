import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';
import { ROUTES } from '@/routes/routes';

export function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center fw-bold" to={ROUTES.HOME} onClick={closeMenu}>
            <span className="brand-mark"><i className="bi bi-check2-square" aria-hidden="true" /></span>
            Task Manager
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}>
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2 py-2 py-lg-0">
              {isAuthenticated ? (
                <>
                  <NavLink className="nav-link" to={ROUTES.DASHBOARD} onClick={closeMenu}>Dashboard</NavLink>
                  <NavLink className="nav-link" to={ROUTES.TASKS} onClick={closeMenu}>Tasks</NavLink>
                  <span className="navbar-text small px-lg-2">{user?.name}</span>
                  <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); closeMenu(); }}>Log out</button>
                </>
              ) : (
                <>
                  <NavLink className="nav-link" to={ROUTES.AUTH.LOGIN} onClick={closeMenu}>Log in</NavLink>
                  <NavLink className="btn btn-light btn-sm text-primary px-3" to={ROUTES.AUTH.REGISTER} onClick={closeMenu}>Create account</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="app-main container py-4 py-lg-5">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="container d-flex flex-wrap justify-content-between gap-2">
          <span>© {new Date().getFullYear()} Task Manager</span>
          <span>Plan clearly. Finish confidently.</span>
        </div>
      </footer>
    </div>
  );
}
