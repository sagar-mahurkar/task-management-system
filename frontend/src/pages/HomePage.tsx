import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';
import { ROUTES } from '@/routes/routes';

const benefits = [
  { icon: 'bi-list-check', title: 'One clear list', description: 'Keep tasks and next actions in one focused workspace.' },
  { icon: 'bi-flag', title: 'Set priorities', description: 'Make important work visible and easier to act on.' },
  { icon: 'bi-calendar2-check', title: 'Track progress', description: 'Use status and due dates to stay oriented.' },
];

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <section className="row align-items-center g-4 g-lg-5 py-4 py-lg-5">
        <div className="col-lg-7">
          <span className="badge rounded-pill text-bg-light border text-primary px-3 py-2 mb-3"><i className="bi bi-stars me-2" aria-hidden="true" />A calmer way to get things done</span>
          <h1 className="display-4 fw-bold lh-sm mb-3" style={{ letterSpacing: '-.045em', color: '#0f172a' }}>
            Make progress, <span className="text-primary">one task</span> at a time.
          </h1>
          <p className="lead text-secondary mb-4" style={{ maxWidth: '38rem' }}>Organize your work, decide what matters next, and keep track of what you have finished—all in one simple workspace.</p>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-primary btn-lg px-4" to={isAuthenticated ? ROUTES.TASKS : ROUTES.AUTH.REGISTER}>{isAuthenticated ? 'Open my tasks' : 'Get started'} <i className="bi bi-arrow-right ms-2" aria-hidden="true" /></Link>
            {isAuthenticated && <Link className="btn btn-outline-secondary btn-lg px-4" to={ROUTES.DASHBOARD}>View dashboard</Link>}
            {!isAuthenticated && <Link className="btn btn-outline-secondary btn-lg px-4" to={ROUTES.AUTH.LOGIN}>Log in</Link>}
          </div>
          {isAuthenticated && <p className="small text-secondary mt-3 mb-0">Welcome back, {user?.name}.</p>}
        </div>
        <div className="col-lg-5">
          <div className="surface-card p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div><p className="page-eyebrow mb-1">Your focus</p><h2 className="h4 fw-bold mb-0">Make today count</h2></div>
              <span className="stat-icon"><i className="bi bi-lightning-charge" aria-hidden="true" /></span>
            </div>
            <div className="d-flex gap-3 align-items-start py-3 border-bottom">
              <span className="text-success fs-5"><i className="bi bi-check-circle-fill" aria-hidden="true" /></span>
              <div><div className="fw-semibold">Know your next step</div><div className="small text-secondary">Turn a big goal into a clear action.</div></div>
            </div>
            <div className="d-flex gap-3 align-items-start py-3 border-bottom">
              <span className="text-primary fs-5"><i className="bi bi-flag-fill" aria-hidden="true" /></span>
              <div><div className="fw-semibold">Prioritize with intention</div><div className="small text-secondary">Give the important work your attention.</div></div>
            </div>
            <div className="d-flex gap-3 align-items-start pt-3">
              <span className="text-warning fs-5"><i className="bi bi-check2-square" aria-hidden="true" /></span>
              <div><div className="fw-semibold">See progress clearly</div><div className="small text-secondary">Celebrate completed work and keep moving.</div></div>
            </div>
          </div>
        </div>
      </section>
      <section className="row g-3 py-4 py-lg-5">
        {benefits.map((benefit) => <div className="col-md-4" key={benefit.title}>
          <article className="surface-card p-4 h-100">
            <span className="stat-icon mb-3"><i className={`bi ${benefit.icon}`} aria-hidden="true" /></span>
            <h2 className="h5 fw-bold">{benefit.title}</h2>
            <p className="text-secondary mb-0">{benefit.description}</p>
          </article>
        </div>)}
      </section>
    </>
  );
}
