// Import the utilities to be tested
const initializeDatabase = require('../utils/initializeDatabase');
const createUsersTable = require('../utils/dbSchemas/usersTable');
const createFavoritesTable = require('../utils/dbSchemas/favoritesTable');
const createRatingsTable = require('../utils/dbSchemas/ratingsTable');
const createReviewsTable = require('../utils/dbSchemas/reviewsTable');

// Mock the database pool module
jest.mock('../config/db', () => ({
    getConnection: jest.fn(() => ({
        query: jest.fn(),
        release: jest.fn()
    }))
}));

describe('Utils', () => {
    describe('initializeDatabase', () => {
        it('should initialize the database by creating necessary tables', async () => {
            // Call the initializeDatabase function
            await initializeDatabase();

            // Assert that getConnection is called once
            expect(require('../config/db').getConnection).toHaveBeenCalledTimes(1);

            // Assert that each table creation function is called once
            expect(createUsersTable).toHaveBeenCalledTimes(1);
            expect(createFavoritesTable).toHaveBeenCalledTimes(1);
            expect(createRatingsTable).toHaveBeenCalledTimes(1);
            expect(createReviewsTable).toHaveBeenCalledTimes(1);

            // Assert that release is called once to release the connection back to the pool
            expect(require('../config/db').getConnection().release).toHaveBeenCalledTimes(1);
        });
    });

    // Additional tests for other utilities can be added here
});
