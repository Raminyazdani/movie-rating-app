/**
 * This controller manages review-related operations including adding/updating, fetching, and deleting reviews.
 */

const pool = require('../config/db'); // Import database configuration to use the connection pool for queries.

/**
 * Adds or updates a review based on the existence of a review by the same user for the same movie and type.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing the updated list of reviews.
 */
exports.addOrUpdateReview = async (req, res) => {
    const { userId, movieId, review, type } = req.body;
    console.log(req.body);
    try {
        const [existingReview] = await pool.query('SELECT * FROM reviews WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, movieId, type]);
        if (existingReview.length === 0) {
            await pool.execute('INSERT INTO reviews (user_id, movie_id, review,type) VALUES (?, ?, ?,?)', [userId, movieId, review, type]);
            const [rows, fields] = await pool.query('SELECT movie_id,type, review FROM reviews WHERE user_id = ?', [userId]);

            const reviews = rows.map(({ movie_id, review, type }) => {
                return { [movie_id]: { review, type } };
            });
            console.log("reviews :", reviews);

            res.json(reviews);
        } else {

            await pool.execute('UPDATE reviews SET review = ? WHERE user_id = ? AND movie_id = ? AND type = ?', [review, userId, movieId, type]);
            const [rows, fields] = await pool.query('SELECT movie_id,type, review FROM reviews WHERE user_id = ?', [userId]);

            const reviews = rows.map(({ movie_id, review, type }) => {
                return { [movie_id]: { review, type } };
            });
            console.log("reviews :", reviews);

            res.json(reviews);
        }
    } catch (error) {
        console.error('Error adding or updating review:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

/**
 * Fetches reviews based on optional filters: userId, movieId, and type.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing the filtered list of reviews.
 */
exports.getReviews = async (req, res) => {
    const { userId, movieId, type } = req.query;

    try {
        let query = 'SELECT movie_id,type FROM reviews';
        let conditions = [];
        let parameters = [];

        if (userId) {
            conditions.push('user_id = ?');
            parameters.push(userId);
        }
        if (movieId) {
            conditions.push('movie_id = ?');
            parameters.push(movieId);
        }
        if (type) {
            conditions.push('type = ?');
            parameters.push(type);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        const [rows, fields] = await pool.query('SELECT movie_id,type, review FROM reviews WHERE user_id = ?', [userId]);

        const reviews = rows.map(({ movie_id, review, type }) => {
            return { [movie_id]: { review, type } };
        });
        console.log("reviews :", reviews);

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

/**
 * Deletes a review specified by userId, movieId, and type.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response indicating the success of the deletion operation.
 */
exports.deleteReview = async (req, res) => {
    const { userId, movieId, type } = req.params;

    try {
        await pool.execute('DELETE FROM reviews WHERE user_id = ? AND movie_id = ? AND type = ?', [userId, movieId, type]);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
