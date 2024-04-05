// Initializes routes related to review operations, using Express' Router.
// It includes the reviews controller for handling the logic of review operations.

const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const router = express.Router();

// Route for adding or updating a review for a movie or TV show.
router.post('/', reviewsController.addOrUpdateReview);

// Route for retrieving all reviews based on specified criteria.
router.get('/', reviewsController.getReviews);

// Route for deleting a specific review by a user.
router.delete('/:userId/:movieId/:type', reviewsController.deleteReview);

// Makes the router accessible to the main application.
module.exports = router;
