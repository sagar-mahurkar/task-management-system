import { useAlert } from '@/context/useAlert';

const alertIcons = {
  success: 'bi-check-circle-fill',
  danger: 'bi-exclamation-triangle-fill',
  warning: 'bi-exclamation-circle-fill',
  info: 'bi-info-circle-fill',
} as const;

export function Alert() {
  const { alert, clearAlert } = useAlert();
  if (!alert) return null;

  return (
    <div className={`alert alert-${alert.type} alert-dismissible fade show m-0 rounded-0 border-0`} role={alert.type === 'danger' ? 'alert' : 'status'} aria-live="polite">
      <div className="container d-flex align-items-start gap-2">
        <i className={`bi ${alertIcons[alert.type]} mt-1`} aria-hidden="true" />
        <div className="flex-grow-1">{alert.message}</div>
        <button type="button" className="btn-close" aria-label="Dismiss alert" onClick={clearAlert} />
      </div>
    </div>
  );
}
