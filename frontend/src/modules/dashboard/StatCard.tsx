type StatCardProps = {
  label: string;
  value: number;
  icon: string;
  description: string;
};

export function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <article className="surface-card stat-card">
      <span className="stat-icon"><i className={`bi ${icon}`} aria-hidden="true" /></span>
      <div className="stat-value">{value}</div>
      <div className="fw-semibold">{label}</div>
      <div className="stat-label mt-1">{description}</div>
    </article>
  );
}
