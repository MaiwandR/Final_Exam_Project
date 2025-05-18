const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

let db;
function injectDB(database) {
  db = database;
}

// Register routes
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();   
  const email = req.body.email.trim(); 
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.collection('userStocks').findOne({ username });
  let error = [];
  if (!username || !password || !email) {
    error.push('All fields are required');
    return res.render('register', { error });
  }

  if (existingUser) error.push('Username already exists');
  const existingEmail = await db.collection('userStocks').findOne({ email });
  if (existingEmail) error.push('Email already exists');
  if (password.length < 6) error.push('Password must be at least 6 characters long');

  if (error.length > 0) return res.render('register', { error });

  const user = await db.collection('userStocks').insertOne({
    username,
    email,
    password: hashedPassword,
    watchlist: [],
    bought: [],
    sold: [],
  });

  req.session.userId = user.insertedId;
  res.redirect('/login');
});

// Login routes
router.get('/login', (req, res) => {
  const error = req.query.error || null;
  res.render('login', { error });
});

router.post('/login', async (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();    
  const user = await db.collection('userStocks').findOne({ username });
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } else {
    const error = 'Invalid username or password';
    res.render('login', { error });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = { authRouter: router, injectAuthDB: injectDB };
