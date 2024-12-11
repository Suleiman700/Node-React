const express = require('express');
const router = express.Router();
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const config = require('../config'); // assuming you have a config file with jwtSecret

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userService.findUserByUsername(username);
    if (user && await user.validatePassword(password)) {
      res.json({
        message: 'Login successful',
        token: jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '5h' }),
      });
    }
    else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  }
  catch (error) {
    res.status(500).json({ state: false, error: error.message });
  }
});

module.exports = router;
