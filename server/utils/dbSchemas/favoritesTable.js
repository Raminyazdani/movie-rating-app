// This utility file defines a function to create the 'favorites' table in the database.
// It ensures the table is created only if it doesn't already exist.

// The function expects a database connection object as its parameter.
async function createFavoritesTable(connection) {
    // Execute a SQL query to create the 'favorites' table with necessary columns.
    // 'id' is an auto-incrementing primary key.
    // 'user_id' links to the 'id' in the 'users' table, establishing a foreign key relationship.
    // 'movie_id' is a string that uniquely identifies a movie.
    // 'type' indicates the category of the favorite item (e.g., movie, TV show, etc.).
    // The FOREIGN KEY constraint ensures 'user_id' references a valid user in the 'users' table.
    await connection.query(`
        CREATE TABLE IF NOT EXISTS favorites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            movie_id VARCHAR(255),
            type VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
    // Log a message to the console indicating the 'favorites' table has been created.
    console.log(`Table favorites created`);
}

// Export the function, so it can be imported and used in other files,
// particularly in the database initialization process.
module.exports = createFavoritesTable;
