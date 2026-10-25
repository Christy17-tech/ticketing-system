import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/ticketService';
import { getStats } from '../services/ticketService';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketRes = await getTickets({ limit: 5 });
        setTickets(ticketRes.data.tickets);
        if (user.role === 'admin') {
          const statsRes = await getStats();
          setStats(statsRes.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="page-container">
      <div className="loading-center"><div className="spinner"></div><p>Loading dashboard...</p></div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Welcome back, {user.name}! 👋</h2>
          <p className="page-subtitle">Here's what's happening with your tickets.</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">+ New Ticket</Link>
      </div>

      {user.role === 'admin' && stats && (
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Tickets</span>
          </div>
          <div className="stat-card stat-open">
            <span className="stat-number">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-card stat-progress">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card stat-resolved">
            <span className="stat-number">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
          <div className="stat-card stat-closed">
            <span className="stat-number">{stats.closed}</span>
            <span className="stat-label">Closed</span>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h3>Recent Tickets</h3>
          <Link to="/tickets" className="link-muted">View all →</Link>
        </div>
        {tickets.length === 0 ? (
          <div className="empty-state">
            <p>🎉 No tickets yet!</p>
            <p>Create your first ticket to get started.</p>
            <Link to="/tickets/new" className="btn btn-primary">Create Ticket</Link>
          </div>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="ticket-card">
                <div className="ticket-card-header">
                  <span className="ticket-title">{ticket.title}</span>
                  <div className="ticket-badges">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <div className="ticket-card-meta">
                  <span>#{ticket._id.slice(-6).toUpperCase()}</span>
                  <span>{ticket.category}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
