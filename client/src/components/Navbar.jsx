import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">🎫 TicketHub</Link>
      </div>
      <div className="navbar-links">
        {user && (
          <>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
            <Link to="/tickets" className={isActive('/tickets') ? 'active' : ''}>My Tickets</Link>
            <Link to="/tickets/new" className={isActive('/tickets/new') ? 'active' : ''}>New Ticket</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link>
            )}
          </>
        )}
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span className="user-badge">{user.role === 'admin' ? '🛡️' : '👤'} {user.name}</span>
            <button className="btn btn-outline-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-sm">Login</Link>
            <Link to="/register" className="btn btn-primary-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
