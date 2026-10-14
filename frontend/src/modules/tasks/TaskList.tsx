import type { Task, TaskStatus } from '@/shared/types/task';

type TaskListProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onCreate: () => void;
};

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

function formatDueDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange, onCreate }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="surface-card empty-state">
        <span className="empty-state-icon"><i className="bi bi-clipboard-check" aria-hidden="true" /></span>
        <h2 className="h5 fw-bold">No tasks match this view</h2>
        <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '25rem' }}>Create a task to get started, or change your filters to see more results.</p>
        <button className="btn btn-primary" type="button" onClick={onCreate}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Create your first task</button>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      {tasks.map((task) => (
        <article className="task-row" key={task.id}>
          <input
            className="form-check-input task-check"
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={(event) => onStatusChange(task, event.target.checked ? 'completed' : 'pending')}
            aria-label={`${task.status === 'completed' ? 'Reopen' : 'Complete'} ${task.title}`}
          />
          <div className="flex-grow-1 min-w-0">
            <div className={`task-title${task.status === 'completed' ? ' text-secondary text-decoration-line-through' : ''}`}>{task.title}</div>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-meta">
              <span className={`status-pill status-${task.status}`}>{statusLabels[task.status]}</span>
              <span className={`priority-pill priority-${task.priority}`}>{task.priority[0].toUpperCase() + task.priority.slice(1)} priority</span>
              {formatDueDate(task.dueDate) && <span className="small text-secondary"><i className="bi bi-calendar3 me-1" aria-hidden="true" />{formatDueDate(task.dueDate)}</span>}
            </div>
          </div>
          <div className="d-flex align-items-center gap-1">
            <button className="btn btn-sm btn-light" type="button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task"><i className="bi bi-pencil" aria-hidden="true" /></button>
            <button className="btn btn-sm btn-light text-danger" type="button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete task"><i className="bi bi-trash3" aria-hidden="true" /></button>
          </div>
        </article>
      ))}
    </div>
  );
}
