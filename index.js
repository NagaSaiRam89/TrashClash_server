import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import troopsRoutes from './routes/troops.js';
import layoutsRoutes from './routes/layouts.js';
import strategiesRoutes from './routes/strategies.js';
import authRoutes from './routes/auth.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secret_key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};



dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/troops', troopsRoutes);
app.use('/api/layouts', layoutsRoutes);
app.use('/api/strategies', strategiesRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/troops', authenticateToken);

app.listen(port, () => {
  console.log(`TrashClash backend running at http://localhost:${port}`);
});
