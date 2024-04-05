// This utility file is responsible for initializing the database.
// It connects to the MySQL database and creates necessary tables if they do not exist.

// Import the centralized database pool configuration
const pool = require('../config/db');

// Import functions to create individual tables
const createUsersTable = require('./dbSchemas/usersTable');
const createFavoritesTable = require('./dbSchemas/favoritesTable');
const createRatingsTable = require('./dbSchemas/ratingsTable');
const createReviewsTable = require('./dbSchemas/reviewsTable');

// The main function to initialize the database
async function initializeDatabase() {
    let connection; // Variable to hold the database connection

    try {
        // Attempt to get a connection from the pool
        connection = await pool.getConnection();
        console.log("Connected to MySQL with database");

        // Sequentially create each table. These functions ensure idempotency,
        // i.e., they only create tables if they don't already exist.
        await createUsersTable(connection);
        await createFavoritesTable(connection);
        await createRatingsTable(connection);
        await createReviewsTable(connection);

        // Log success message after all tables are ensured to exist
        console.log('Database and tables initialized successfully');
    } catch (error) {
        // Catch and log any errors during initialization
        console.error('Error initializing database:', error);
    } finally {
        // Ensure that the database connection is released back to the pool
        // This is crucial to prevent connection leaks
        if (connection) {
            await connection.release();
        }
    }
}

// Export the initializeDatabase function to be used in the main application
module.exports = initializeDatabase;
