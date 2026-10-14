import { useAlert } from '@/context/useAlert';

export function Alert() {
  const { alert, clearAlert } = useAlert();
  if (!alert) return null;

  return (
    <div className={`alert alert-${alert.type} alert-dismissible fade show m-3`} role="alert">
      {alert.message}
      <button type="button" className="btn-close" aria-label="Dismiss alert" onClick={clearAlert} />
    </div>
  );
}
