/**
 * This controller handles user-related operations such as checking user existence,
 * creating a new user, and fetching user ID by email.
 */

const pool = require('../config/db'); // Utilizes the database connection pool configured in the 'config/db' module.

/**
 * Checks if a user exists based on the provided email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response indicating whether the user exists.
 */
exports.checkUser = async (req, res) => {
    console.log('Checking user with email:', req.params.email);
    try {
        const { email } = req.params;
        const [results] = await pool.execute('SELECT COUNT(*) AS userCount FROM users WHERE email = ?', [email]);

        const userCount = results[0].userCount;
        res.json({ exists: userCount > 0 });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

/**
 * Creates a new user in the database with the provided email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing the newly created user's ID.
 */
exports.createUser = async (req, res) => {
    console.log('Creating user with email:', req.body.email);
    try {
        const { email } = req.body;
        const [result] = await pool.execute('INSERT INTO users (email) VALUES (?)', [email]);

        res.json({ userId: result.insertId, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

/**
 * Fetches the ID of a user based on their email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing the user's ID.
 */
exports.getUserId = async (req, res) => {
    console.log('Fetching user ID for email:', req.params.email);
    try {
        const { email } = req.params;
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching user ID:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
