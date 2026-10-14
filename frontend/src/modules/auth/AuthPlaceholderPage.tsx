import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

type Props = { mode: 'login' | 'register' };

export function AuthPlaceholderPage({ mode }: Props) {
  const isLogin = mode === 'login';
  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <h1 className="h3">{isLogin ? 'Log in' : 'Create your account'}</h1>
        <p className="text-secondary">Authentication form will be implemented in Phase 11.</p>
        <Link to={isLogin ? ROUTES.AUTH.REGISTER : ROUTES.AUTH.LOGIN}>
          {isLogin ? 'Need an account? Register' : 'Already registered? Log in'}
        </Link>
      </div>
    </section>
  );
}
