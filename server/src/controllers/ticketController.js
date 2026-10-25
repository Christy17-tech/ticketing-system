const Ticket = require('../models/Ticket');

// GET /api/tickets
const getTickets = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;

    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ticket.countDocuments(filter),
    ]);

    res.json({
      tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tickets/:id
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.author', 'name email');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (
      req.user.role !== 'admin' &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// POST /api/tickets
const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      createdBy: req.user._id,
    });

    const populated = await ticket.populate('createdBy', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tickets/:id
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const allowedFields = ['title', 'description', 'priority', 'category'];
    if (isAdmin) allowedFields.push('status', 'assignedTo');

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) ticket[field] = req.body[field];
    });

    const updated = await ticket.save();
    await updated.populate('createdBy', 'name email');
    await updated.populate('assignedTo', 'name email');
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tickets/:id
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/tickets/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.comments.push({ text, author: req.user._id });
    await ticket.save();
    await ticket.populate('comments.author', 'name email');

    res.status(201).json(ticket.comments[ticket.comments.length - 1]);
  } catch (err) {
    next(err);
  }
};

// GET /api/tickets/stats (admin only)
const getStats = async (req, res, next) => {
  try {
    const [total, open, inProgress, resolved, closed] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'in-progress' }),
      Ticket.countDocuments({ status: 'resolved' }),
      Ticket.countDocuments({ status: 'closed' }),
    ]);

    res.json({ total, open, inProgress, resolved, closed });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  getStats,
};
