const express = require('express');
const pool   = require('../db');
const router = express.Router();

// GET /api/products  — list all available products (optionally filter by category)
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    let query  = 'SELECT * FROM products WHERE available = true';
    const params = [];
    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }
    query += ' ORDER BY category, name';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/categories — distinct categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products WHERE available=true ORDER BY category');
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
