// Establishes routes for movie recommendations.
// Utilizes the Express library and links to the recommendation controller for request handling.

const express = require('express');
const recommendationsController = require('../controllers/recommendationsController');
const router = express.Router();

// Route to generate movie recommendations for a specific user.
router.get('/:userId', recommendationsController.getRecommendations);

// Allows the router to be utilized in other parts of the application.
module.exports = router;
