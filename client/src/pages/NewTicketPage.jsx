import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketService';
import toast from 'react-hot-toast';

const NewTicketPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'support',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 200) errs.title = 'Title must be under 200 characters';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.length > 2000) errs.description = 'Description must be under 2000 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await createTicket(form);
      toast.success('Ticket created successfully!');
      navigate(`/tickets/${data._id}`);
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to create ticket' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Create New Ticket</h2>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {errors.server && <div className="alert alert-error">{errors.server}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="bug">Bug</option>
                <option value="feature">Feature Request</option>
                <option value="support">Support</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              rows={6}
            />
            <span className="char-count">{form.description.length}/2000</span>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner-sm"></span> : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketPage;
