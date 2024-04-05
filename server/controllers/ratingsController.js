/**
 * Controller for fetching, adding, updating, and removing ratings for movies.
 */

const pool = require('../config/db'); // Ensure you have a db configuration that exports a pool

/**
 * Fetches ratings for a given user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing ratings for the user.
 */
exports.fetchRatings = async (req, res) => {
    console.log("Fetching ratings for user:", req.params.userId);
    try {
        const userId = req.params.userId;
        const [rows, fields] = await pool.query('SELECT movie_id,type, rating FROM ratings WHERE user_id = ?', [userId]);

        const ratings = rows.map(({movie_id, rating, type}) => {
            return {[movie_id]: {rating, type}};
        });
        console.log("ratings :", ratings);

        res.json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({error: 'Database error'});
    }
};

/**
 * Adds or updates a rating for a movie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing updated ratings.
 */
exports.addOrUpdateRating = async (req, res) => {
    console.log('Adding or updating rating:', req.body);
    const {userId, movieId, rating, type} = req.body;

    try {
        const [existingRating] = await pool.query('SELECT * FROM ratings WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, movieId, type]);

        if (existingRating.length === 0) {
            await pool.execute('INSERT INTO ratings (user_id, movie_id, rating,type) VALUES (?, ?, ?,?)', [userId, movieId, rating, type]);
        } else {
            await pool.execute('UPDATE ratings SET rating = ? WHERE user_id = ? AND movie_id = ? AND type = ?', [rating, userId, movieId, type]);
        }
        const [rows, fields] = await pool.query('SELECT movie_id,type, rating FROM ratings WHERE user_id = ?', [userId]);

        const ratings = rows.map(({movie_id, rating, type}) => {
            return {[movie_id]: {rating, type}};
        });
        console.log("ratings :", ratings);

        res.json(ratings);
    } catch (error) {
        console.error('Error adding or updating rating:', error);
        res.status(500).json({error: 'Database error'});
    }
};

/**
 * Removes a rating for a movie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing updated ratings.
 */
exports.removeRating = async (req, res) => {
    console.log('Removing rating:', req.params);
    try {
        const {userId, movieId, type} = req.params;
        await pool.execute('DELETE FROM ratings WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, movieId, type]);
        const [rows, fields] = await pool.query('SELECT movie_id,type, rating FROM ratings WHERE user_id = ?', [userId]);

        const ratings = rows.map(({movie_id, rating, type}) => {
            return {[movie_id]: {rating, type}};
        });
        console.log("ratings :", ratings);

        res.json(ratings);
    } catch (error) {
        console.error('Error removing rating:', error);
        res.status(500).json({error: 'Database error'});
    }
};
