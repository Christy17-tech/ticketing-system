import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket, deleteTicket, addComment } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import toast from 'react-hot-toast';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await getTicketById(id);
        setTicket(data);
        setStatusUpdate(data.status);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusUpdate(newStatus);
    try {
      const { data } = await updateTicket(id, { status: newStatus });
      setTicket(data);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await deleteTicket(id);
      toast.success('Ticket deleted');
      navigate('/tickets');
    } catch {
      toast.error('Failed to delete ticket');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      await addComment(id, { text: comment });
      const { data } = await getTicketById(id);
      setTicket(data);
      setComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return (
    <div className="page-container">
      <div className="loading-center"><div className="spinner"></div><p>Loading ticket...</p></div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
      <button className="btn btn-outline" onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  const isOwner = ticket.createdBy?._id === user._id || ticket.createdBy === user._id;
  const isAdmin = user.role === 'admin';

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>

      <div className="ticket-detail-card">
        <div className="ticket-detail-header">
          <div>
            <span className="ticket-id-large">#{ticket._id.slice(-6).toUpperCase()}</span>
            <h2>{ticket.title}</h2>
          </div>
          <div className="ticket-detail-badges">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="ticket-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <span className="capitalize">{ticket.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created by</span>
            <span>{ticket.createdBy?.name || 'Unknown'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Assigned to</span>
            <span>{ticket.assignedTo?.name || 'Unassigned'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created</span>
            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Updated</span>
            <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-controls">
            <label htmlFor="status-select">Update Status:</label>
            <select id="status-select" value={statusUpdate} onChange={handleStatusChange}>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}

        <div className="ticket-description">
          <h4>Description</h4>
          <p>{ticket.description}</p>
        </div>

        {(isOwner || isAdmin) && (
          <div className="ticket-actions">
            {isOwner && (
              <button className="btn btn-danger-outline" onClick={handleDelete}>
                🗑 Delete Ticket
              </button>
            )}
          </div>
        )}
      </div>

      <div className="comments-section">
        <h3>Comments ({ticket.comments?.length || 0})</h3>

        {ticket.comments?.length === 0 && (
          <p className="text-muted">No comments yet. Be the first to reply!</p>
        )}

        <div className="comments-list">
          {ticket.comments?.map((c, i) => (
            <div key={i} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">{c.author?.name || 'Unknown'}</span>
                <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleComment} className="comment-form">
          <div className="form-group">
            <label htmlFor="comment">Add a comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={commentLoading || !comment.trim()}>
            {commentLoading ? <span className="spinner-sm"></span> : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetailPage;
