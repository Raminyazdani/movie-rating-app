// This file defines the routes related to user operations using Express' Router.
// It imports the necessary modules, including the user controller to handle the request logic.

const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Defines a route for checking if a user exists by their email.
router.get('/checkUser/:email', userController.checkUser);

// Defines a route for creating a new user.
router.post('/createUser', userController.createUser);

// Defines a route for retrieving a user's ID based on their email.
router.get('/getUserId/:email', userController.getUserId);

// Exports the router so it can be used by the main application.
module.exports = router;
