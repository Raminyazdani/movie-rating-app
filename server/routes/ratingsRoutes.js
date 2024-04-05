// Establishes routes for operations related to movie and TV show ratings.
// Uses the Express library and links to the ratings controller for request handling.

const express = require('express');
const ratingsController = require('../controllers/ratingsController');
const router = express.Router();

// Route to fetch all ratings made by a specific user.
router.get('/:userId', ratingsController.fetchRatings);

// Route to add a new rating or update an existing one.
router.post('/', ratingsController.addOrUpdateRating);

// Route to delete a specific rating by a user.
router.delete('/:userId/:movieId/:type', ratingsController.removeRating);

// Allows the router to be utilized in other parts of the application.
module.exports = router;
