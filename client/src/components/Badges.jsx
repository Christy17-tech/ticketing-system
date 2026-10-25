const StatusBadge = ({ status }) => {
  const map = {
    open: { label: 'Open', cls: 'badge-open' },
    'in-progress': { label: 'In Progress', cls: 'badge-progress' },
    resolved: { label: 'Resolved', cls: 'badge-resolved' },
    closed: { label: 'Closed', cls: 'badge-closed' },
  };
  const { label, cls } = map[status] || { label: status, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
};

const PriorityBadge = ({ priority }) => {
  const map = {
    low: { label: 'Low', cls: 'priority-low' },
    medium: { label: 'Medium', cls: 'priority-medium' },
    high: { label: 'High', cls: 'priority-high' },
    urgent: { label: 'Urgent', cls: 'priority-urgent' },
  };
  const { label, cls } = map[priority] || { label: priority, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
};

export { StatusBadge, PriorityBadge };
