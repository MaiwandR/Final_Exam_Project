const express = require('express');
const { authRouter, injectAuthDB } = require('./routes/authRoutes');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('templates'));

// The session is a middleware that helps store the current user ID
// this way we can check if user is loged in or not as well as user spefic info 
// SESSION_SECRET is a secret key used to sign the session ID cookie
// it should be kept secret in production and its just a random value stored in the .env file


app.use(session({
    secret: process.env.SESSION_SECRET || 'devSecret',
    resave: false,
    saveUninitialized: false
  }));
app.set('view engine', 'ejs'); // ✅ add this
app.set('views', './templates'); // ✅ add this too

  

const PORT = 3000;

let db;

// This URL is for the front page it gives daily stock data regarding gainers, losers, and
// most active in the stock market for the day.

const STAR_URL = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${process.env.API_KEY}`;
MongoClient.connect(process.env.DB_CONNECT_STRING)
  .then(client => {
    db = client.db(process.env.DB_NAME);
    injectAuthDB(db); // give db to auth routes
    app.use(authRouter); // use auth routes
    app.listen(PORT, () => {
      console.log(`Server is running on: http://127.0.0.1:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

  // For the index Path we map the stuff we get from the API call and
  // redner it in the index.ejs file
  // You'll see in the **catch statement** that we have dummy data
  // The API only allows 25 calss a day so this dummy data is jsut their
  // we can style the page wihtout haveing to worry about the API limits



app.get('/', (req, res) => {
  fetch(STAR_URL)
    .then(response => response.json())
    .then(data => {
      const stars = data['top_gainers'];
      const losers = data['top_losers'];
      const update = data['last_updated'];
      const actives = data['most_actively_traded'];
      res.render('index', {
        stars,
        update,
        losers,
        actives,
        logginIn: req.session.userId ? true : false,
       }); // ✅ render 'index', not 'index.ejs'
    })
    .catch(error => {
        console.error('API fetch error:', error);
        res.render('index', {
          stars: [
            { ticker: 'AAPL', price: 175.50, change_amount: 2.10, change_percentage: '1.21%' },
            { ticker: 'MSFT', price: 320.40, change_amount: 3.45, change_percentage: '1.09%' }
          ],
          losers: [
            { ticker: 'TSLA', price: 185.00, change_amount: -5.10, change_percentage: '-2.68%' }
          ],
          actives: [
            { ticker: 'AMZN', price: 125.00, volume: 8500000 },
            { ticker: 'NVDA', price: 480.00, volume: 7200000 }
          ],
          update: '2025-05-08 16:00:00',
          logginIn: false,
        });
      });
});

// The search path is used for specfic stocks
// it basically takes a ticker like AAPL or TSLA and fetches the data for that stock
// The data is then rendered in the detail.ejs file
// You'll see we get some info out of the stock especially cause we need i
// to render the chart using the latest 10 days of data

// DUMMY DATA FOR DEBUGGING AND STYLING

app.get('/search', (req, res) => {
    const name = req.query.search;
    res.redirect(`/search/${name}`);
});

app.get('/search/:name', (req, res) => {
    const name = req.params.name;
    const Search_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${name}&apikey=${process.env.API_KEY}`;
    fetch(Search_URL)
        .then(response => response.json())
        .then(data => {
            const update = data['Meta Data']['3. Last Refreshed'];
            
            const dates = Object.keys(data['Time Series (Daily)']).slice(0, 10);
            const lastTen = dates.map(date => ({
                date,
                open: data['Time Series (Daily)'][date]['1. open'],
                high: data['Time Series (Daily)'][date]['2. high'],
                low: data['Time Series (Daily)'][date]['3. low'],
                close: data['Time Series (Daily)'][date]['4. close'],
                volume: data['Time Series (Daily)'][date]['5. volume'],
            }));

            res.render('detail', {
                name,
                update,
                lastTen,
                logginIn: req.session.userId ? true : false,
            })

        })
        .catch(error => {
            console.error('API fetch error:', error);
            const dummyDates = [
              '2025-05-08', '2025-05-07', '2025-05-06', '2025-05-05', '2025-05-04',
              '2025-05-03', '2025-05-02', '2025-05-01', '2025-04-30', '2025-04-29'
            ];
            const lastTen = dummyDates.map(date => ({
              date,
              open: '150.00',
              high: '155.00',
              low: '148.00',
              close: '152.00',
              volume: '1200000'
            }));
          
            res.render('detail', {
              name: req.params.name || 'AAPL',
              update: '2025-05-08',
              lastTen,
              logginIn: req.session.userId ? true : false,
            });
          });
});


// The first register renders the register.ejs file
// The second one is used to register the user
// We hash the password using bcrypt and store it in the database
// We also set the current user ID in the session from the database

// app.get('/register', (req, res) => {
//     res.render('register', { error: null });
// });

// app.post('/register', async (req, res) => {
//   const username = req.body.username.trim();
//   const password = req.body.password.trim();   
//   const email = req.body.email.trim(); 
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const existingUser = await db.collection('userStocks').findOne({ username });
//     error = [];
//     if (!username || !password || !email) {
//         error.push('All fields are required');
//         return res.render('register', { error: error});
//     }

//     if (existingUser) {
//          error.push('Username already exists');
//     }
//     const existingEmail = await db.collection('userStocks').findOne({ email });
//     if (existingEmail) {
//          error.push('Email already exists');
//     }
//     if (password.length < 6) {
//          error.push('Password must be at least 6 characters long');
//     }
//     if (error.length > 0) {
//         return res.render('register', { error });

//     }

//     const user = await db.collection('userStocks').insertOne({
//         username,
//         email,
//         password: hashedPassword,
//         watchlist: [],
//         bought: [],
//         sold: [],
//     });
//     req.session.userId = user.insertedId;
//     res.redirect('/login');
// } );

// // The first login renders the login.ejs file
// // The second one is used to log the user in

// // We set the currnt user ID in the sesison form the database

// app.get('/login', (req, res) => {
//     const error = req.query.error || null;
//     res.render('login', {error});
// });

// app.post('/login', async (req, res) => {
//   const username = req.body.username.trim();
//   const password = req.body.password.trim();    
//   const user = await db.collection('userStocks').findOne({username});
//     if (user && await bcrypt.compare(password, user.password)) {
//         req.session.userId = user._id;
//         res.redirect('/dashboard');
//     } else{
//         const error = 'Invalid username or password';
//         res.render('login', {error});
//     }
// });

// // The logout path is used to log the user out
// // We destroy the session and redirect to the index page

// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

// Buy funtionality 
// User buy stock when they vist the detail page for a stock
// Then they fill out a form that asks them how many share they want to buy
app.get('/buy', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
      return res.redirect('/login');
  }
  const user = await db.collection('userStocks').findOne({ _id: new ObjectId(userId) });
      const ticker = req.query.ticker || ''; 
      const price = req.query.price || '';
      const message = req.session.message || null;
    delete req.session.message;
  res.render('buy', { user,ticker, price, message });
});

app.post('/buy', async (req, res) => {
  const { ticker, price, amount } = req.body;
  const parseamount = parseFloat(amount);
  const parsedPrice = parseFloat(price);
  const total = parseamount * parsedPrice; 
  const userId = req.session.userId;
  const user = await db.collection('userStocks').findOne({ _id: new ObjectId(userId) });
  const bought = user.bought || [];
  bought.push({ ticker, price: parsedPrice, amount: parseamount, total });
  await db.collection('userStocks').updateOne(
    { _id: new ObjectId(userId) },
     { $set: { bought } });
     const message = `Successfully purchased ${parseamount} share(s) of ${ticker} at $${parsedPrice.toFixed(2)} each.`;
  req.session.message = message;
  res.redirect('/buy');
});

// Sell functionality
// Makes the proper checks before makeing any sale or changes to user data
// It checks if the user has the stock in their bought list and if they have enough shares to sell
// If they do we update the bought list and add the stock to the sold list
app.get('/sell', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');

  const user = await db.collection('userStocks').findOne({ _id: new ObjectId(userId) });
  const ticker = req.query.ticker || '';
  const price = req.query.price || '';
  const message = req.session.sellMessage || null;
  delete req.session.sellMessage;

  res.render('sell', { user, ticker, price, message });
});

app.post('/sell', async (req, res) => {
  const { ticker, price, amount } = req.body;
  const quantityToSell = parseFloat(amount);
  const currentPrice = parseFloat(price);
  const userId = req.session.userId;

  const user = await db.collection('userStocks').findOne({ _id: new ObjectId(userId) });

  const totalBought = (user.bought || [])
    .filter(tx => tx.ticker === ticker)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSold = (user.sold || [])
    .filter(tx => tx.ticker === ticker)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const available = totalBought - totalSold;

  if (quantityToSell > available) {
    req.session.sellMessage = `You only have ${available} share(s) of ${ticker} to sell.`;
    return res.redirect(`/sell?ticker=${ticker}&price=${price}`);
  }

  const sold = user.sold || [];
  sold.push({
    ticker,
    price: currentPrice,
    amount: quantityToSell,
    total: currentPrice * quantityToSell,
  });

  await db.collection('userStocks').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { sold } }
  );

  req.session.sellMessage = `Sold ${quantityToSell} share(s) of ${ticker} at $${currentPrice.toFixed(2)}.`;
  res.redirect(`/sell?ticker=${ticker}&price=${price}`);
});


// User Dashboard which will help users see stocks transactions and more information about theri portfolio
// The dashboard will show the bought and sold stocks
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await db.collection(process.env.MONGO_COLLECTION).findOne({ _id: new ObjectId(req.session.userId) });

    const bought = user.bought || [];
const sold = user.sold || [];

const ownedStocks = {};

// Aggregate bought
bought.forEach(txn => {
  if (!ownedStocks[txn.ticker]) {
    ownedStocks[txn.ticker] = 0;
  }
  ownedStocks[txn.ticker] += txn.amount;
});

// Subtract sold
sold.forEach(txn => {
  if (!ownedStocks[txn.ticker]) {
    ownedStocks[txn.ticker] = 0;
  }
  ownedStocks[txn.ticker] -= txn.amount;
});

// Remove stocks with 0 or less shares
Object.keys(ownedStocks).forEach(ticker => {
  if (ownedStocks[ticker] <= 0) {
    delete ownedStocks[ticker];
  }
});

   res.render('dashboard', { user, ownedStocks });
  } catch (err) {
    console.error('Error fetching user stocks:', err);
    res.status(500).send('Internal Server Error');
  }
});


