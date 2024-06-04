const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001; // Updated port number
const dbName = 'movie_watchlist';
const dbUri = `mongodb://localhost:27017/${dbName}`;
const omdbApiKey = 'fef87550';

mongoose.set('strictQuery', true); // Add this line to handle deprecation warning
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: String,
  watchlist: [{ type: String }]
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/signin', (req, res) => {
  res.render('signin');
});
app.get('/signout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    // Redirect the user to the sign-in page
    res.redirect('/signin');
  });
  

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect('/signin');
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).send('Username or email already exists');
    } else {
      res.status(500).send('Internal server error');
    }
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, 'secretkey');
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } else {
    res.redirect('/signin');
  }
});

app.get('/dashboard', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/signin');
  const decoded = jwt.verify(token, 'secretkey');
  const user = await User.findOne({ username: decoded.username });
  res.render('dashboard', { user });
});

// app.post('/search', async (req, res) => {
//   const { query } = req.body;
//   const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${omdbApiKey}`);
//   res.json(response.data);
// });
app.post('/search', async (req, res) => {
    const { query } = req.body;
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${omdbApiKey}`);
      const movies = response.data.Search.map(async (movie) => {
        const detailedResponse = await axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${omdbApiKey}`);
        const { Title, Poster, imdbRating } = detailedResponse.data;
        return {
          imdbID: movie.imdbID,
          Title,
          Poster,
          imdbRating
        };
      });
      const detailedMovies = await Promise.all(movies);
      res.json(detailedMovies);
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// app.post('/add-to-watchlist', async (req, res) => {
//   const token = req.cookies.token;
//   if (!token) return res.redirect('/signin');
//   const decoded = jwt.verify(token, 'secretkey');
//   const user = await User.findOne({ username: decoded.username });
//   user.watchlist.push(req.body.movieId);
//   await user.save();
//   res.redirect('/dashboard');
// });
app.post('/add-to-watchlist', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/signin');
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findOne({ username: decoded.username });
    
    // Validate and sanitize movie ID
    const movieId = req.body.movieId.trim(); // Trim whitespace
    if (!/^[a-zA-Z0-9_-]+$/.test(movieId)) {
      return res.status(400).send('Invalid movie ID');
    }
  
    // Add sanitized movie ID to watchlist
    user.watchlist.push(movieId);
    await user.save();
    res.redirect('/dashboard');
  });

  app.post('/delete-from-watchlist', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/signin');
        
        const decoded = jwt.verify(token, 'secretkey');
        const user = await User.findOne({ username: decoded.username });
        if (!user) return res.sendStatus(404); // User not found

        const movieIdToDelete = req.body.movieId;
        // Remove movieIdToDelete from user's watchlist
        user.watchlist = user.watchlist.filter(movieId => movieId !== movieIdToDelete);
        
        await user.save();
        res.sendStatus(200); // Send success status code
    } catch (error) {
        console.error('Error deleting movie from watchlist:', error);
        res.sendStatus(500); // Internal Server Error
    }
});

  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
