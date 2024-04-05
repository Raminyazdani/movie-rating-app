// This utility function is designed to create the 'reviews' table in the database
// if it does not already exist. The function is asynchronous and uses a connection
// to the database to run SQL commands.

async function createReviewsTable(connection) {
    // Executes an SQL query to create the 'reviews' table with specific columns.
    // The table includes an auto-incrementing 'id' as a primary key, 'user_id' to link the review to a user,
    // 'movie_id' and 'type' to identify the reviewed item, 'rating' as an integer, and 'review' as text.
    // A foreign key constraint is set on 'user_id' to ensure it references a valid user in the 'users' table.
    await connection.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            movie_id VARCHAR(255),
            rating INT,
            review TEXT,
            type VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
    // Logs a confirmation message once the table is successfully created or confirmed to exist.
    console.log(`Table reviews created`);
}

// Exports the function so it can be used elsewhere in the project, particularly
// for database setup or migrations.
module.exports = createReviewsTable;
