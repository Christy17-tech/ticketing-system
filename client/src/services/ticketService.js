import api from './api';

export const getTickets = (params) => api.get('/tickets', { params });
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);
export const addComment = (id, data) => api.post(`/tickets/${id}/comments`, data);
export const getStats = () => api.get('/tickets/stats');
