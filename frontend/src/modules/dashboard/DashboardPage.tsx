import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from '@/context/useAlert';
import { getApiErrorMessage } from '@/api/apiError';
import { dashboardApi } from '@/modules/dashboard/dashboardApi';
import type { TaskSummary } from '@/shared/types/taskSummary';
import { ROUTES } from '@/routes/routes';
import { StatCard } from '@/modules/dashboard/StatCard';

const emptySummary: TaskSummary = {
  totalTasks: 0,
  byStatus: { pending: 0, in_progress: 0, completed: 0 },
  byPriority: { low: 0, medium: 0, high: 0 },
};

export function DashboardPage() {
  const [summary, setSummary] = useState<TaskSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    let active = true;
    dashboardApi.getSummary()
      .then((data) => { if (active) setSummary(data); })
      .catch((error: unknown) => {
        if (active) showAlert('danger', getApiErrorMessage(error, 'Unable to load dashboard summary.'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showAlert]);

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

      {loading && <p className="small text-secondary" role="status">Loading dashboard…</p>}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4"><StatCard label="Pending" value={summary.byStatus.pending} icon="bi-hourglass-split" description="Waiting to be started" /></div>
        <div className="col-12 col-sm-6 col-xl-4"><StatCard label="In progress" value={summary.byStatus.in_progress} icon="bi-arrow-repeat" description="Work currently underway" /></div>
        <div className="col-12 col-sm-6 col-xl-4"><StatCard label="Completed" value={summary.byStatus.completed} icon="bi-check2-circle" description="Tasks you have finished" /></div>
      </div>

      <div className="surface-card p-4 p-md-5">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <span className="empty-state-icon flex-shrink-0 mb-0"><i className="bi bi-compass" aria-hidden="true" /></span>
          <div className="flex-grow-1">
            <h2 className="h5 fw-bold mb-2">{summary.totalTasks === 0 ? 'Start with one clear next step' : `${summary.totalTasks} ${summary.totalTasks === 1 ? 'task' : 'tasks'} in your workspace`}</h2>
            <p className="text-secondary mb-0">Create a task, set its priority, and add a due date when it helps. Your summary reflects tasks saved on the server.</p>
          </div>
          <Link className="btn btn-outline-primary flex-shrink-0" to={ROUTES.TASKS}>View tasks <i className="bi bi-arrow-right ms-1" aria-hidden="true" /></Link>
        </div>
      </div>
      <p className="small text-secondary mt-3 mb-0"><i className="bi bi-info-circle me-1" aria-hidden="true" />Summary is scoped to your account.</p>
    </section>
  );
}
