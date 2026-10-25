import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../services/ticketService';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await getTickets(params);
      setTickets(data.tickets);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Tickets</h2>
        <Link to="/tickets/new" className="btn btn-primary">+ New Ticket</Link>
      </div>

      <div className="filter-bar">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Category</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="support">Support</option>
          <option value="billing">Billing</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading && (
        <div className="loading-center"><div className="spinner"></div><p>Loading tickets...</p></div>
      )}
      {error && <div className="alert alert-error">{error} <button onClick={fetchTickets}>Retry</button></div>}

      {!loading && !error && tickets.length === 0 && (
        <div className="empty-state">
          <p>📭 No tickets found.</p>
          <p>Try changing your filters or create a new ticket.</p>
          <Link to="/tickets/new" className="btn btn-primary">Create Ticket</Link>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <>
          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t._id}>
                    <td><span className="ticket-id">#{t._id.slice(-6).toUpperCase()}</span></td>
                    <td><Link to={`/tickets/${t._id}`} className="ticket-link">{t.title}</Link></td>
                    <td><span className="capitalize">{t.category}</span></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="btn btn-outline-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >← Prev</button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button
              className="btn btn-outline-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
            >Next →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketListPage;
