import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍫</span>
          <span className="logo-text">Choco<em>_Bite</em></span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Menu</Link></li>
          {isLoggedIn && <li><Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>My Orders</Link></li>}
        </ul>

        {/* Right section */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user?.name?.split(' ')[0]}!</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login"  className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/">Menu</Link>
          {isLoggedIn && <Link to="/orders">My Orders</Link>}
          <Link to="/cart">Cart {totalItems > 0 && `(${totalItems})`}</Link>
          {isLoggedIn
            ? <button onClick={handleLogout}>Logout</button>
            : <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign up</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
}
