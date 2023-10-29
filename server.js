const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
require('dotenv').config();

// Configure Express to use EJS for rendering views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'CHNsPortfolio',
  resave: false,
  saveUninitialized: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,  // 30 seconds
  socketTimeoutMS: 60000   // 60 seconds
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
});

// Once the MongoDB connection is open, start the Express server
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});
  
  // Body parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Require your routes
const routes = require('./routes/routes');

// Use your routes
app.use('/', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
