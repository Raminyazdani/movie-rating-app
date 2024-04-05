// This function is tasked with setting up the 'users' table within the database,
// ensuring that it's only created if it doesn't already exist. This process is
// vital for initial database setup or migrations.

async function createUsersTable(connection) {
    // The SQL command executed here creates the 'users' table with two fields:
    // 'id', which is an automatically incrementing integer serving as the primary key,
    // and 'email', a variable character string that is required and must be unique.
    // The unique constraint prevents duplicate email addresses, ensuring each user is distinct.
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE
        )
    `);
    // Upon successful execution of the query, a message is logged to the console
    // indicating that the 'users' table has been created or already exists.
    console.log(`Table users created`);
}

// The function is exported to allow its use in other parts of the application,
// such as during the initialization phase where the database schema is set up.
module.exports = createUsersTable;
