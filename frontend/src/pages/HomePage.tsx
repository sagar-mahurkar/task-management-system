import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useAuth } from '@/modules/auth/useAuth';

export function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <section className="py-5 text-center">
      <h1 className="display-5 fw-semibold">Make your tasks manageable.</h1>
      <p className="lead text-secondary mt-3">Organize work, track priorities, and keep moving.</p>
      <Link className="btn btn-primary btn-lg mt-3" to={isAuthenticated ? ROUTES.TASKS : ROUTES.AUTH.REGISTER}>
        {isAuthenticated ? 'View tasks' : 'Get started'}
      </Link>
    </section>
  );
}
