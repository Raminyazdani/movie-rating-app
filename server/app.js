// Load environment variables from .env file
require('dotenv').config({ path: '../.env' });

// Import necessary libraries
const express = require('express'); // Express framework for handling HTTP requests
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const cors = require('cors'); // Middleware to enable CORS (Cross-Origin Resource Sharing)

// Import utility functions and route handlers
const initializeDatabase = require("./utils/initializeDatabase"); // Function to initialize the database
const userRoutes = require('./routes/userRoutes'); // Routes related to user operations
const favoriteRoutes = require('./routes/favoritesRoutes'); // Routes related to favorite items
const ratingRoutes = require('./routes/ratingsRoutes'); // Routes related to ratings
const reviewRoutes = require('./routes/reviewsRoutes'); // Routes related to reviews
const recommendationsRoutes = require('./routes/recommendationsRoutes'); // Routes for fetching recommendations
// Initialize express app
const app = express();
// Apply necessary middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies of incoming requests

// Initialize database (create tables, setup connections, etc.)
initializeDatabase();

// Setup route handlers
app.use('/api/users', userRoutes); // Handle all user-related endpoints under /api/users
app.use('/api/favorites', favoriteRoutes); // Handle favorites-related endpoints under /api/favorites
app.use('/api/ratings', ratingRoutes); // Handle ratings-related endpoints under /api/ratings
app.use('/api/reviews', reviewRoutes); // Handle reviews-related endpoints under /api/reviews
app.use('/api/recommendations', recommendationsRoutes); // Handle recommendation-related endpoints under /api/recommendations

// Define the port to listen on. Defaults to 3001 if not specified in the environment variables
const PORT = process.env.PORT || 3001;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
