import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

// Get strategies by mode
router.get('/', async (req, res) => {
  const mode = req.query.mode;
  if (!mode || (mode !== 'builder' && mode !== 'town')) {
    return res.status(400).json({ error: 'Invalid or missing mode' });
  }

  try {
    const result = await pool.query('SELECT * FROM strategies WHERE mode = $1', [mode]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a strategy
router.post('/', async (req, res) => {
  const { name, troop_combo, tips, image_url, mode } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO strategies (name, troop_combo, tips, image_url, mode) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, troop_combo, tips, image_url, mode]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a strategy
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, troop_combo, tips, image_url, mode } = req.body;

    const result = await pool.query(
      'UPDATE strategies SET name = $1, troop_combo = $2, tips = $3, image_url = $4, mode = $5 WHERE id = $6 RETURNING *',
      [name, troop_combo, tips, image_url, mode, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating strategy:', err);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

// Delete a strategy
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM strategies WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
