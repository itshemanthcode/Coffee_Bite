-- Choco_Bite Database Schema

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
('Dark Truffle',              'Silky 72% single-origin dark chocolate truffle',                    3.50, 'Dark Chocolate'),
('Milk Chocolate Bar',        'Creamy Swiss-style milk chocolate, smooth & velvety',               4.00, 'Milk Chocolate'),
('White Chocolate Mousse',    'Airy white chocolate mousse with vanilla bean',                     5.00, 'White Chocolate'),
('Hazelnut Praline',          'Crunchy roasted hazelnut enrobed in milk chocolate',                4.50, 'Truffles'),
('Salted Caramel Bonbon',     'Rich caramel center with Himalayan pink salt finish',               4.00, 'Truffles'),
('Hot Dark Chocolate',        'Intense Belgian dark cocoa, served piping hot',                     5.50, 'Hot Chocolate'),
('Belgian Waffle & Chocolate','Warm Belgian waffle drizzled with dark & white chocolate',          7.50, 'Chocolate Desserts'),
('Chocolate Lava Cake',       'Warm molten chocolate center with a crisp outer shell',             8.00, 'Chocolate Desserts'),
('Cocoa Brownie',             'Dense fudgy brownie loaded with dark chocolate chunks',             5.00, 'Chocolate Desserts'),
('Chocolate Croissant',       'Buttery, flaky croissant filled with dark chocolate',               4.50, 'Chocolate Desserts'),
('Mint Chocolate Chip',       'Cool peppermint ganache in dark chocolate shell',                   3.50, 'Truffles'),
('Raspberry Ganache',         'Tangy raspberry puree swirled into bittersweet ganache',            4.00, 'Truffles'),
('Pistachio Bark',            'White chocolate bark studded with pistachios & cranberries',        6.00, 'White Chocolate'),
('Espresso Chocolate',        'Dark chocolate infused with freshly ground espresso beans',         4.50, 'Dark Chocolate');
