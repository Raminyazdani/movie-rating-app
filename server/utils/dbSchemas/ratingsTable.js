// This file defines a function for creating the 'ratings' table within the database.
// The function is designed to be idempotent, creating the table only if it does not already exist.

// A connection object is passed to the function, allowing it to execute SQL commands.
async function createRatingsTable(connection) {
    // The SQL command within `connection.query` is executed against the database.
    // The 'ratings' table includes several columns:
    // 'id' serves as a unique identifier for each entry and automatically increments.
    // 'user_id' associates the rating with a user and acts as a foreign key to the 'users' table.
    // 'movie_id' is a varchar field that likely stores an identifier for movies or TV shows.
    // 'rating' is an integer representing the user's rating.
    // 'type' might differentiate between different kinds of rated items, such as movies or TV shows.
    // The FOREIGN KEY constraint ensures integrity by linking 'user_id' back to an existing user.
    await connection.query(`
        CREATE TABLE IF NOT EXISTS ratings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            movie_id VARCHAR(255),
            rating INT,
            type VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
    // Logs a message to the console to confirm the successful creation of the 'ratings' table.
    console.log(`Table ratings created`);
}

// Exports the `createRatingsTable` function, making it available for import in other files,
// specifically in scripts that set up or migrate the database.
module.exports = createRatingsTable;
