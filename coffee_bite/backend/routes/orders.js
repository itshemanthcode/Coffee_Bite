const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// POST /api/orders  — place a new order (auth required)
router.post('/', auth, async (req, res) => {
  const { items, notes } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Order must contain at least one item.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const total = items.reduce((sum, i) => sum + parseFloat(i.price) * parseInt(i.quantity), 0);

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount, notes) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, total.toFixed(2), notes || null]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      // Validate product exists & get current price
      const product = await client.query('SELECT id, price FROM products WHERE id = $1 AND available = true', [item.product_id]);
      if (!product.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product ID ${item.product_id} not found or unavailable.` });
      }
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, product.rows[0].price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order error:', err);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  } finally {
    client.release();
  }
});

// GET /api/orders/my  — get logged-in user's orders (auth required)
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id, o.total_amount, o.status, o.notes, o.created_at,
         json_agg(
           json_build_object(
             'product_id', oi.product_id,
             'name',       p.name,
             'quantity',   oi.quantity,
             'price',      oi.price
           ) ORDER BY oi.id
         ) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p  ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id  — single order detail (auth required, own order)
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('name', p.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Order not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
