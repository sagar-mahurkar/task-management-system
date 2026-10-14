import { useMemo, useState } from 'react';
import { useAlert } from '@/context/useAlert';
import { TaskForm } from '@/modules/tasks/TaskForm';
import { TaskList } from '@/modules/tasks/TaskList';
import type { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/shared/types/task';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const { showAlert } = useAlert();

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !query || task.title.toLowerCase().includes(query) || (task.description ?? '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleSave(input: CreateTaskInput) {
    const now = new Date().toISOString();
    if (editingTask) {
      setTasks((current) => current.map((task) => task.id === editingTask.id ? {
        ...task,
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? task.status,
        priority: input.priority ?? task.priority,
        dueDate: input.dueDate ?? null,
        updatedAt: now,
      } : task));
      showAlert('success', 'Task updated in this preview. Changes are not saved to the server yet.');
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? 'pending',
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate ?? null,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((current) => [newTask, ...current]);
      showAlert('success', 'Task added to this preview. It will be saved through the API in Phase 12.');
    }
    setFormOpen(false);
    setEditingTask(null);
  }

  function handleDelete(task: Task) {
    if (!window.confirm(`Delete “${task.title}”? This action cannot be undone in this preview.`)) return;
    setTasks((current) => current.filter((item) => item.id !== task.id));
    showAlert('success', 'Task removed from this preview.');
  }

  function handleStatusChange(task: Task, status: TaskStatus) {
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status, updatedAt: new Date().toISOString() } : item));
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
          <TaskForm task={editingTask} onSubmit={handleSave} onCancel={() => { setFormOpen(false); setEditingTask(null); }} />
        </div>
      )}

      {!formOpen && (
        <>
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
            <span className="small text-secondary">Preview data only</span>
          </div>
          <TaskList tasks={visibleTasks} onEdit={openEditForm} onDelete={handleDelete} onStatusChange={handleStatusChange} onCreate={openCreateForm} />
        </>
      )}
    </section>
  );
}
