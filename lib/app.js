const express = require('express');
const cookieParser = require('cookie-parser');
const jsonParser = express.json();
const cors = require('cors');
const app = express();
const authenticateAWS = require('./middleware/authenticateAWS');

// Built in middleware
// app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4242'],
    credentials: true,
  })
);

// App routes

app.use('/api/v1/auth', jsonParser, require('./controllers/auth'));

app.use(
  '/api/v1/create-checkout-session',
  [jsonParser, authenticateAWS],
  require('./controllers/checkout')
);

app.use(
  '/api/v1/subscription',
  [authenticateAWS],
  require('./controllers/editSubscription')
);

//
app.use(
  '/api/v1/create-customer-portal-session',
  [authenticateAWS],
  require('./controllers/customerPortal')
);

app.use('/api/v1/webhook', require('./controllers/webhook'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
