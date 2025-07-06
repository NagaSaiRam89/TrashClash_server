import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

// GET layouts by mode
router.get('/', async (req, res) => {
  const mode = req.query.mode;

  if (!mode || !['builder', 'town'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid or missing mode' });
  }

  try {
    const result = await pool.query('SELECT * FROM layouts WHERE mode = $1', [mode]);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /layouts error:', err);
    res.status(500).send('Server error');
  }
});

// POST new layout
router.post('/', async (req, res) => {
  const { name, type, image_urls, layout_url, description, mode } = req.body;

  if (!name || !type || !description || !mode || !Array.isArray(image_urls)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO layouts (name, type, image_urls, layout_url, description, mode) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, type, image_urls, layout_url, description, mode]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /layouts error:', err);
    res.status(500).send('Server error');
  }
});

// PUT update layout
router.put('/:id', async (req, res) => {
  const { name, type, image_urls, layout_url, description, mode } = req.body;

  if (!name || !type || !description || !mode || !Array.isArray(image_urls)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const result = await pool.query(
      'UPDATE layouts SET name = $1, type = $2, image_urls = $3, layout_url = $4, description = $5, mode = $6 WHERE id = $7',
      [name, type, image_urls, layout_url, description, mode, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('PUT /layouts/:id error:', err);
    res.status(500).send('Server error');
  }
});

// DELETE layout
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM layouts WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /layouts/:id error:', err);
    res.status(500).send('Server error');
  }
});

export default router;
