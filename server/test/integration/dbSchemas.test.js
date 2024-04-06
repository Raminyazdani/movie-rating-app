const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../config/mysql-config'); // Importing the MySQL configuration

const {
    createFavoritesTable,
    createRatingsTable,
    createReviewsTable,
    createUsersTable
} = require('../utils/dbSchemas');

// Establishing connection to the MySQL database using the provided configuration
const connection = mysql.createConnection(MYSQL_CONFIG);

// Test suite for testing database schema creation functions
describe('Database Schema Creation Tests', () => {
    beforeAll((done) => {
        // Establish connection before running the tests
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to database:', err);
                done(err);
            } else {
                console.log('Connected to database');
                done();
            }
        });
    });

    afterAll((done) => {
        // Close connection after running the tests
        connection.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
                done(err);
            } else {
                console.log('Connection to database closed');
                done();
            }
        });
    });

    // Test case for creating the 'favorites' table
    it('should create the favorites table', async () => {
        await createFavoritesTable(connection);

        // Check if the favorites table exists in the database
        connection.query('SHOW TABLES LIKE "favorites"', (err, result) => {
            if (err) {
                throw err;
            }
            expect(result.length).toBe(1);
        });
    });

    // Test case for creating the 'ratings' table
    it('should create the ratings table', async () => {
        await createRatingsTable(connection);

        // Check if the ratings table exists in the database
        connection.query('SHOW TABLES LIKE "ratings"', (err, result) => {
            if (err) {
                throw err;
            }
            expect(result.length).toBe(1);
        });
    });

    // Test case for creating the 'reviews' table
    it('should create the reviews table', async () => {
        await createReviewsTable(connection);

        // Check if the reviews table exists in the database
        connection.query('SHOW TABLES LIKE "reviews"', (err, result) => {
            if (err) {
                throw err;
            }
            expect(result.length).toBe(1);
        });
    });

    // Test case for creating the 'users' table
    it('should create the users table', async () => {
        await createUsersTable(connection);

        // Check if the users table exists in the database
        connection.query('SHOW TABLES LIKE "users"', (err, result) => {
            if (err) {
                throw err;
            }
            expect(result.length).toBe(1);
        });
    });
});
