import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/field"
          className={`nav-link ${location.pathname === '/field' ? 'active' : ''}`}
        >
          Field
        </Link>
      </div>
    </nav>
  );
};
