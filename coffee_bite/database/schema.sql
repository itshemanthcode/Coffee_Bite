-- Coffee_Bite Database Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL
);

-- Seed Products
INSERT INTO products (name, description, price, category) VALUES
('Espresso',        'Rich, bold single shot of pure coffee',           2.50, 'Coffee'),
('Cappuccino',      'Espresso with velvety steamed milk foam',          4.00, 'Coffee'),
('Latte',           'Smooth espresso with creamy steamed milk',         4.50, 'Coffee'),
('Americano',       'Espresso diluted with hot water, clean & strong',  3.00, 'Coffee'),
('Cold Brew',       'Slow-steeped 18hr cold coffee, silky smooth',      4.50, 'Coffee'),
('Mocha',           'Espresso blended with rich chocolate sauce',       5.00, 'Coffee'),
('Caramel Macchiato','Vanilla latte with caramel drizzle',              5.50, 'Coffee'),
('Matcha Latte',    'Ceremonial grade matcha with steamed oat milk',    5.00, 'Specialty'),
('Chai Latte',      'Spiced chai tea with warm steamed milk',           4.50, 'Specialty'),
('Croissant',       'Buttery, flaky French pastry baked fresh daily',   3.50, 'Pastry'),
('Blueberry Muffin','Bursting with blueberries, baked each morning',    3.00, 'Pastry'),
('Cinnamon Roll',   'Soft rolled pastry with cream cheese glaze',       4.00, 'Pastry'),
('Avocado Toast',   'Smashed avo on sourdough with chilli flakes',      7.50, 'Food'),
('Club Sandwich',   'Triple-decker with chicken, bacon & fresh greens', 8.50, 'Food');
