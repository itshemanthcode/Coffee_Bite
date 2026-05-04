import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart }  from '../context/CartContext';
import { useAuth }  from '../context/AuthContext';
import { API_URL } from '../config';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="page checkout-page">
        <div className="container checkout-login-prompt">
          <div className="prompt-icon">🔒</div>
          <h2>Sign in to place your order</h2>
          <p>You need to be logged in to checkout.</p>
          <div className="prompt-btns">
            <Link to="/login"  className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="page checkout-page">
        <div className="container checkout-login-prompt">
          <div className="prompt-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <Link to="/" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page checkout-page">
        <div className="container checkout-success">
          <div className="success-icon">✅</div>
          <h1>Order Placed!</h1>
          <p>Your order has been received and is being prepared. 🍫</p>
          <div className="success-btns">
            <Link to="/orders" className="btn btn-primary">View My Orders</Link>
            <Link to="/"       className="btn btn-outline">Order More</Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price })),
        notes,
      };
      const res  = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Order failed.'); return; }
      clearCart();
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Review your order before placing it.</p>

        <div className="checkout-layout">
          {/* Order review */}
          <div className="checkout-items">
            <h2 className="section-label">Your Items</h2>
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                <span className="checkout-item-name">{item.name} <span className="checkout-qty">× {item.quantity}</span></span>
                <span className="checkout-item-price">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="notes-group">
              <label>Special instructions (optional)</label>
              <textarea
                rows={3}
                placeholder="E.g. gift wrapping, no nuts, extra dark…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Payment summary */}
          <div className="checkout-summary card">
            <h2>Order Total</h2>
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Tax (5%)</span>
              <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
            </div>
            <div className="checkout-divider" />
            <div className="checkout-total-row grand">
              <span>Grand Total</span>
              <span>₹{(totalPrice * 1.05).toFixed(2)}</span>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              className="btn btn-primary place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing order…' : '🍫 Place Order'}
            </button>

            <Link to="/cart" className="btn btn-outline back-btn">← Back to Cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
