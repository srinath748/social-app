const jwt = require('jsonwebtoken');
const User = require('../models/User');  // ✅ import User model

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, password are required' });
    }

    const user = await User.create({ username, email, password, name });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl || null,
        bio: user.bio || '',
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue)[0];
      return res.status(409).json({ message: `${key} already exists` });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl || null,
        bio: user.bio || '',
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
