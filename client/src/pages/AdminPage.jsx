import { useEffect, useState } from 'react';
import { getTickets, getStats, updateTicket, deleteTicket } from '../services/ticketService';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const [ticketsRes, statsRes] = await Promise.all([getTickets(params), getStats()]);
      setTickets(ticketsRes.data.tickets);
      setPagination(ticketsRes.data.pagination);
      setStats(statsRes.data);
    } catch {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicket(ticketId, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(ticketId);
      toast.success('Ticket deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete ticket');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🛡️ Admin Dashboard</h2>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-total"><span className="stat-number">{stats.total}</span><span className="stat-label">Total</span></div>
          <div className="stat-card stat-open"><span className="stat-number">{stats.open}</span><span className="stat-label">Open</span></div>
          <div className="stat-card stat-progress"><span className="stat-number">{stats.inProgress}</span><span className="stat-label">In Progress</span></div>
          <div className="stat-card stat-resolved"><span className="stat-number">{stats.resolved}</span><span className="stat-label">Resolved</span></div>
          <div className="stat-card stat-closed"><span className="stat-number">{stats.closed}</span><span className="stat-label">Closed</span></div>
        </div>
      )}

      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading && <div className="loading-center"><div className="spinner"></div></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t._id}>
                    <td><span className="ticket-id">#{t._id.slice(-6).toUpperCase()}</span></td>
                    <td><Link to={`/tickets/${t._id}`} className="ticket-link">{t.title}</Link></td>
                    <td>{t.createdBy?.name}</td>
                    <td className="capitalize">{t.category}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <select
                        className="select-inline"
                        value={t.status}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(t._id)} title="Delete">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button className="btn btn-outline-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button className="btn btn-outline-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
