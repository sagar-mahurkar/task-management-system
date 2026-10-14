import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAlert } from '@/context/useAlert';
import { getApiErrorMessage } from '@/api/apiError';
import { tasksApi } from '@/modules/tasks/tasksApi';
import { TaskForm } from '@/modules/tasks/TaskForm';
import { TaskList } from '@/modules/tasks/TaskList';
import type { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/shared/types/task';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const { showAlert } = useAlert();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tasksApi.list({
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(priorityFilter !== 'all' ? { priority: priorityFilter } : {}),
      });
      setTasks(data);
    } catch (error) {
      showAlert('danger', getApiErrorMessage(error, 'Unable to load tasks.'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, showAlert]);

  useEffect(() => {
    let cancelled = false;

    async function fetchTasks() {
      setLoading(true);

      try {
        const data = await tasksApi.list({
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
          ...(priorityFilter !== 'all' ? { priority: priorityFilter } : {}),
        });

        if (!cancelled) setTasks(data);
      } catch (error) {
        if (!cancelled) {
          showAlert('danger', getApiErrorMessage(error, 'Unable to load tasks.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, priorityFilter, showAlert]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => !query
      || task.title.toLowerCase().includes(query)
      || (task.description ?? '').toLowerCase().includes(query));
  }, [tasks, search]);

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSave(input: CreateTaskInput) {
    setSaving(true);
    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, input);
        showAlert('success', 'Task updated.');
      } else {
        await tasksApi.create(input);
        showAlert('success', 'Task created.');
      }
      setFormOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      showAlert('danger', getApiErrorMessage(error, 'Unable to save the task.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete “${task.title}”? This action cannot be undone.`)) return;
    try {
      await tasksApi.remove(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      showAlert('success', 'Task deleted.');
    } catch (error) {
      showAlert('danger', getApiErrorMessage(error, 'Unable to delete the task.'));
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      const updatedTask = await tasksApi.update(task.id, { status });
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item));
    } catch (error) {
      showAlert('danger', getApiErrorMessage(error, 'Unable to update task status.'));
    }
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">Your workspace</p>
          <h1 className="h2 page-title">Tasks</h1>
          <p className="page-subtitle">Keep the next action clear and the important work moving.</p>
        </div>
        {!formOpen && <button className="btn btn-primary" type="button" onClick={openCreateForm}><i className="bi bi-plus-lg me-2" aria-hidden="true" />New task</button>}
      </div>

      {formOpen && (
        <div className="mb-4">
          <TaskForm task={editingTask} isSubmitting={saving} onSubmit={handleSave} onCancel={() => { if (!saving) { setFormOpen(false); setEditingTask(null); } }} />
        </div>
      )}

      {!formOpen && <>
        <div className="surface-card p-3 mb-3">
          <div className="task-toolbar">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary" aria-hidden="true" />
              <input className="form-control ps-5" type="search" aria-label="Search tasks" placeholder="Search tasks…" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <select className="form-select" aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as TaskStatus | 'all')}>
              <option value="all">All statuses</option><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option>
            </select>
            <select className="form-select" aria-label="Filter by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | 'all')}>
              <option value="all">All priorities</option><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
            </select>
            {(search || statusFilter !== 'all' || priorityFilter !== 'all') && <button className="btn btn-light" type="button" onClick={clearFilters}>Clear filters</button>}
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small text-secondary">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</span>
          <button className="btn btn-sm btn-link" type="button" onClick={() => void loadTasks()} disabled={loading}>Refresh</button>
        </div>
        {loading ? <div className="surface-card p-4 text-secondary" role="status">Loading tasks…</div> : <TaskList tasks={visibleTasks} onEdit={openEditForm} onDelete={handleDelete} onStatusChange={handleStatusChange} onCreate={openCreateForm} />}
      </>}
    </section>
  );
}
