// Configures routes for managing users' favorite movies and TV shows.
// Implements Express' Router and involves the favorites controller for operational logic.

const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Route to retrieve a list of a user's favorite items.
router.get('/:userId', favoritesController.fetchFavorites);

// Route for adding an item to a user's favorites.
router.post('/', favoritesController.addFavorite);

// Route for removing an item from a user's favorites.
router.delete('/:userId/:imdbId/:type', favoritesController.removeFavorite);

// Exports the defined router for global application use.
module.exports = router;
