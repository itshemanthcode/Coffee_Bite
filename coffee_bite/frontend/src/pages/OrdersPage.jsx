import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch('/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => { setError('Failed to load orders.'); setLoading(false); });
  }, [token, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="page orders-page">
        <div className="container orders-prompt">
          <div className="prompt-icon">🔒</div>
          <h2>Please sign in to view your orders</h2>
          <Link to="/login" className="btn btn-primary">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Your complete order history</p>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error   && <div className="error-box">{error}</div>}

        {!loading && orders.length === 0 && (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you place one.</p>
            <Link to="/" className="btn btn-primary">Browse Menu</Link>
          </div>
        )}

        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-date">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <span>{item.name} <span className="item-qty">× {item.quantity}</span></span>
                    <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <p className="order-notes">📝 {order.notes}</p>
              )}

              <div className="order-footer">
                <span className="order-total">Total: <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
