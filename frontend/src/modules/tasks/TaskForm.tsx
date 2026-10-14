import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/shared/types/task';

type TaskFormProps = {
  task?: Task | null;
  onSubmit: (input: CreateTaskInput) => void;
  onCancel: () => void;
};

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pending');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [titleError, setTitleError] = useState('');


  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Task title is required.');
      return;
    }
    if (trimmedTitle.length > 200) {
      setTitleError('Task title must be 200 characters or fewer.');
      return;
    }
    setTitleError('');
    onSubmit({
      title: trimmedTitle,
      description: description.trim() || null,
      status,
      priority,
      dueDate: dueDate || null,
    });
  }

  return (
    <form className="surface-card p-3 p-md-4" onSubmit={handleSubmit} noValidate>
      <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h5 fw-bold mb-1">{task ? 'Edit task' : 'Create a task'}</h2>
          <p className="small text-secondary mb-0">Capture the next thing you need to get done.</p>
        </div>
        <button className="btn btn-sm btn-light" type="button" onClick={onCancel} aria-label="Close task form"><i className="bi bi-x-lg" aria-hidden="true" /></button>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="task-title">Title <span className="text-danger">*</span></label>
        <input id="task-title" autoFocus className={`form-control${titleError ? ' is-invalid' : ''}`} maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Review project requirements" aria-describedby={titleError ? 'task-title-error' : undefined} />
        {titleError && <div id="task-title-error" className="invalid-feedback">{titleError}</div>}
        <div className="form-text text-end">{title.length}/200</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="task-description">Description <span className="text-secondary fw-normal">(optional)</span></label>
        <textarea id="task-description" className="form-control" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add details or a few notes…" />
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label" htmlFor="task-status">Status</label>
          <select id="task-status" className="form-select" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-sm-6">
          <label className="form-label" htmlFor="task-priority">Priority</label>
          <select id="task-priority" className="form-select" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="task-due-date">Due date <span className="text-secondary fw-normal">(optional)</span></label>
        <input id="task-due-date" className="form-control" type="date" value={dueDate ?? ''} onChange={(event) => setDueDate(event.target.value)} />
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-light" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary px-4" type="submit">{task ? 'Save changes' : 'Create task'}</button>
      </div>
    </form>
  );
}
