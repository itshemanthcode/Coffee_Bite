import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page empty-cart-page">
        <div className="container empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} in your order</p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item card">
                <div className="cart-item-emoji">{item.name[0] === 'E' ? '☕' : '🍽'}</div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">₹{parseFloat(item.price).toFixed(2)} each</p>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-subtotal">
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove">✕</button>
              </div>
            ))}

            <button className="btn btn-outline clear-btn" onClick={clearCart}>Clear cart</button>
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              {items.map(item => (
                <div key={item.id} className="summary-row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">₹{totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary checkout-btn">Proceed to Checkout →</Link>
            <Link to="/" className="btn btn-outline back-btn">← Add more items</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
