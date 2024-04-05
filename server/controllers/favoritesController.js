/**
 * Controller for managing user favorites.
 */

const pool = require('../config/db'); // Assuming you have a pool export in your db config

/**
 * Fetches favorites for a given user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing user's favorites.
 */
exports.fetchFavorites = async (req, res) => {
    console.log('Fetching favorites for user:', req.params.userId);
    try {
        const {userId} = req.params;
        const [rows, fields] = await pool.query('SELECT movie_id,type FROM favorites WHERE user_id = ?', [userId]);
        console.log(rows)
        res.json(rows);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({error: 'Database error'});
    }
};

/**
 * Adds a movie to favorites for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing updated list of favorites.
 */
exports.addFavorite = async (req, res) => {
    console.log('Adding movie to favorites:', req.body);

    try {
        const {userId, imdbId, type} = req.body;

        const [existingFavorites] = await pool.query('SELECT * FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, imdbId, type]);

        if (existingFavorites.length === 0) {
            await pool.execute('INSERT INTO favorites (user_id, movie_id,type) VALUES (?, ?,?)', [userId, imdbId, type]);
        }

        const [rows, fields] = await pool.query('SELECT movie_id,type FROM favorites WHERE user_id = ?', [userId]);
        console.log(rows)

        res.json(rows);
    } catch (error) {
        console.error('Error adding movie to favorites:', error);
        res.status(500).json({error: 'Database error'});
    }
};

/**
 * Removes a movie from favorites for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing updated list of favorites.
 */
exports.removeFavorite = async (req, res) => {
    console.log('Removing movie from favorites:', req.params);
    try {
        const {userId, imdbId, type} = req.params;

        const [existingFavorites] = await pool.query('SELECT * FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, imdbId, type]);

        if (existingFavorites.length > 0) {
            await pool.execute('DELETE FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, imdbId, type]);
        }

        const [rows, fields] = await pool.query('SELECT movie_id,type FROM favorites WHERE user_id = ?', [userId]);
        console.log(rows)

        res.json(rows);
    } catch (error) {
        console.error('Error removing movie from favorites:', error);
        res.status(500).json({error: 'Database error'});
    }
};
