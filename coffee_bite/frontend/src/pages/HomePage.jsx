import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './HomePage.css';

const CATEGORY_ICONS = {
  'Dark Chocolate':    '🍫',
  'Milk Chocolate':    '🥛',
  'White Chocolate':   '🤍',
  'Truffles':          '🟤',
  'Hot Chocolate':     '☕',
  'Chocolate Desserts':'🍰',
  'Gift Boxes':        '🎁',
};

const PRODUCT_EMOJIS = {
  'Dark Truffle':              '🟤',
  'Milk Chocolate Bar':        '🍫',
  'White Chocolate Mousse':    '🤍',
  'Hazelnut Praline':          '🌰',
  'Salted Caramel Bonbon':     '🍬',
  'Hot Dark Chocolate':        '☕',
  'Belgian Waffle & Chocolate':'🧇',
  'Chocolate Lava Cake':       '🍰',
  'Cocoa Brownie':             '🟫',
  'Chocolate Croissant':       '🥐',
  'Mint Chocolate Chip':       '🌿',
  'Raspberry Ganache':         '🫐',
  'Pistachio Bark':            '💚',
  'Espresso Chocolate':        '☕',
};

export default function HomePage() {
  const [products,  setProducts]  = useState([]);
  const [category,  setCategory]  = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        const cats = ['All', ...new Set(data.map(p => p.category))];
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = category === 'All'
    ? products
    : products.filter(p => p.category === category);

  const handleAdd = (product) => {
    addItem(product);
    setToast(product.name);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <p className="hero-eyebrow">Artisan Chocolate & More</p>
          <h1 className="hero-title">
            Crafted with<br/>
            <em>cocoa</em> &amp; love.
          </h1>
          <p className="hero-desc">
            Every bite tells a story. Indulge in our handcrafted chocolates made from the finest beans.
          </p>
          <a href="#menu" className="btn btn-primary">Explore Menu ↓</a>
        </div>
        <div className="hero-deco">🍫</div>
      </section>

      {/* Menu */}
      <section id="menu" className="menu-section">
        <div className="container">
          <div className="section-header">
            <h2 className="page-title">Our Menu</h2>
            <p className="page-subtitle">Handcrafted, indulgent, and ready for you.</p>
          </div>

          {/* Category tabs */}
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {CATEGORY_ICONS[cat] || '🍫'} {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-emoji">
                    {PRODUCT_EMOJIS[product.name] || '🍫'}
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">₹{parseFloat(product.price).toFixed(2)}</span>
                      <button className="btn btn-primary add-btn" onClick={() => handleAdd(product)}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="toast toast-success">
          ✓ {toast} added to cart!
        </div>
      )}
    </>
  );
}
