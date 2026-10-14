import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { StatCard } from '@/modules/dashboard/StatCard';

export function DashboardPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1 className="h2 page-title">Your dashboard</h1>
          <p className="page-subtitle">A quick view of your workload and what needs attention.</p>
        </div>
        <Link className="btn btn-primary" to={ROUTES.TASKS}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Manage tasks</Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4"><StatCard label="Pending" value={0} icon="bi-hourglass-split" description="Waiting to be started" /></div>
        <div className="col-12 col-sm-6 col-xl-4"><StatCard label="In progress" value={0} icon="bi-arrow-repeat" description="Work currently underway" /></div>
        <div className="col-12 col-sm-6 col-xl-4"><StatCard label="Completed" value={0} icon="bi-check2-circle" description="Tasks you have finished" /></div>
      </div>

      <div className="surface-card p-4 p-md-5">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <span className="empty-state-icon flex-shrink-0 mb-0"><i className="bi bi-compass" aria-hidden="true" /></span>
          <div className="flex-grow-1">
            <h2 className="h5 fw-bold mb-2">Start with one clear next step</h2>
            <p className="text-secondary mb-0">Create a task, set its priority, and add a due date when it helps. Your dashboard summary will reflect saved tasks after API integration.</p>
          </div>
          <Link className="btn btn-outline-primary flex-shrink-0" to={ROUTES.TASKS}>View tasks <i className="bi bi-arrow-right ms-1" aria-hidden="true" /></Link>
        </div>
      </div>
      <p className="small text-secondary mt-3 mb-0"><i className="bi bi-info-circle me-1" aria-hidden="true" />Dashboard values are UI placeholders until Phase 12 connects the API.</p>
    </section>
  );
}
