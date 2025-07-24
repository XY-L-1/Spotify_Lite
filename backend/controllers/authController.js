require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// sign up
exports.signup = async (req, res) => {
   try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
         return res.status(400).json({ error: 'username, email and password required' });
      }

      // hash the password
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, passwordHash });

      const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, userId: user._id });
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};

// log in
exports.login = async (req, res) => {
   try {
      const { emailOrUsername, password } = req.body;
      if (!emailOrUsername || !password) {
         return res.status(400).json({ error: 'emailOrUsername and password required' });
      }

      const user = await User.findOne({
         $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
      });
      if (!user) {
         return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
         return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, userId: user._id });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};
