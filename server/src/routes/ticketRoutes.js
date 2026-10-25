const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  getStats,
} = require('../controllers/ticketController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.get('/stats', adminOnly, getStats);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.post('/:id/comments', addComment);

module.exports = router;
