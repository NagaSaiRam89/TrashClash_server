import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const mode = req.query.mode;

  if (!mode || (mode !== 'builder' && mode !== 'town')) {
    return res.status(400).json({ error: 'Invalid or missing mode (builder or town)' });
  }

  try {
    const result = await pool.query('SELECT * FROM troops WHERE mode = $1', [mode]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
    const { name, type, level, description, image_url, mode } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO troops (name, type, level, description, image_url, mode) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, type, level, description, image_url ,mode]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

  router.put('/:id', async (req, res) => {
    const { name, type, level, description, image_url,mode } = req.body;
    try {
      await pool.query(
        'UPDATE troops SET name = $1, type = $2, level = $3, description = $4,image_url = $5, mode = $6 WHERE id = $7',
        [name, type, level, description, image_url, mode, req.params.id]
      );
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

  router.delete('/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM troops WHERE id = $1', [req.params.id]);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

export default router;
