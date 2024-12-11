const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3039', // Replace with your client's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Controllers
// const userController = require('./user/userController');

// Routes
const routes = require('./routes/routes');
app.use(routes);
// app.use('/api/users', userController);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
