import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAlert } from '@/context/useAlert';
import { useAuth } from '@/modules/auth/useAuth';
import { authApi } from '@/modules/auth/authApi';
import { getApiErrorMessage } from '@/api/apiError';
import { ROUTES } from '@/routes/routes';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const result = await authApi.login({ email: email.trim(), password });
      login(result.accessToken, result.user);
      showAlert('success', 'You are now logged in.');
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(destination || ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      showAlert('danger', getApiErrorMessage(error, 'Unable to log in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <header className="auth-card-header">
        <span className="auth-brand"><i className="bi bi-person-lock" aria-hidden="true" /></span>
        <p className="page-eyebrow">Welcome back</p>
        <h1 className="h2 fw-bold mb-2">Log in to your account</h1>
        <p className="text-secondary mb-0">Pick up where you left off and keep your work moving.</p>
      </header>
      <div className="auth-card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input id="login-email" className={`form-control${errors.email ? ' is-invalid' : ''}`} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} aria-describedby={errors.email ? 'login-email-error' : undefined} />
            {errors.email && <div id="login-email-error" className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-group">
              <input id="login-password" className={`form-control${errors.password ? ' is-invalid' : ''}`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby={errors.password ? 'login-password-error' : undefined} />
              <button className="btn btn-outline-secondary" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}><i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" /></button>
              {errors.password && <div id="login-password-error" className="invalid-feedback d-block">{errors.password}</div>}
            </div>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit" disabled={submitting}>{submitting ? 'Logging in…' : <>Log in <i className="bi bi-arrow-right ms-1" aria-hidden="true" /></>}</button>
        </form>
        <p className="text-center text-secondary small mt-4 mb-0">New to Task Manager? <Link to={ROUTES.AUTH.REGISTER} className="fw-semibold text-decoration-none">Create an account</Link></p>
      </div>
    </section>
  );
}
