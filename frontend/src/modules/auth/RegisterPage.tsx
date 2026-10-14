import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from '@/context/useAlert';
import { useAuth } from '@/modules/auth/useAuth';
import { authApi } from '@/modules/auth/authApi';
import { getApiErrorMessage } from '@/api/apiError';
import { ROUTES } from '@/routes/routes';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Enter your name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (!confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const result = await authApi.register({ name: name.trim(), email: email.trim(), password });
      login(result.accessToken, result.user);
      showAlert('success', 'Your account has been created.');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      showAlert('danger', getApiErrorMessage(error, 'Unable to create your account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <header className="auth-card-header">
        <span className="auth-brand"><i className="bi bi-person-plus" aria-hidden="true" /></span>
        <p className="page-eyebrow">Get organized</p>
        <h1 className="h2 fw-bold mb-2">Create your account</h1>
        <p className="text-secondary mb-0">A simple space to plan, prioritize, and finish your tasks.</p>
      </header>
      <div className="auth-card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="register-name">Full name</label>
            <input id="register-name" className={`form-control${errors.name ? ' is-invalid' : ''}`} autoComplete="name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="register-email">Email address</label>
            <input id="register-email" className={`form-control${errors.email ? ' is-invalid' : ''}`} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="register-password">Password</label>
            <div className="input-group">
              <input id="register-password" className={`form-control${errors.password ? ' is-invalid' : ''}`} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="btn btn-outline-secondary" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}><i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" /></button>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="register-confirm-password">Confirm password</label>
            <input id="register-confirm-password" className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`} type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : <>Create account <i className="bi bi-arrow-right ms-1" aria-hidden="true" /></>}</button>
        </form>
        <p className="text-center text-secondary small mt-4 mb-0">Already have an account? <Link to={ROUTES.AUTH.LOGIN} className="fw-semibold text-decoration-none">Log in</Link></p>
      </div>
    </section>
  );
}
