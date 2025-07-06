import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const JWT_SECRET = 'super_secret_key';

router.post('/login', (req, res) => {
    console.log('Login attempt:', req.body); // Log the login attempt for debugging
    const { username, password } = req.body;
  
    if (!username || !password) {     
        return res.status(400).json({ message: 'Missing username or password' });
      }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  });
  
  export default router;