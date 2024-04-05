/**
 * Controller for generating movie recommendations for a given user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {JSON} - JSON response containing movie recommendations.
 */
const pool = require('../config/db'); // Ensure you have a centralized db configuration
exports.getRecommendations = async (req, res) => {
    const { userId } = req.params;
    console.log("fetch recommendations for user ", userId);
    try {
        // Count total users in the system
        const [usersCountResult] = await pool.query('SELECT COUNT(*) AS count FROM users');
        const { count: totalUsers } = usersCountResult[0];

        // Retrieve user's favorite movies and high-rated movies
        const [userFavorites] = await pool.query('SELECT movie_id, type FROM favorites WHERE user_id = ?', [userId]);
        const [highRatedMovies] = await pool.query('SELECT movie_id, type FROM ratings WHERE user_id = ? AND rating > 3', [userId]);

        // Combine and filter duplicate movie IDs and types
        let combinedIdsTypes = [...userFavorites, ...highRatedMovies];
        combinedIdsTypes = combinedIdsTypes.reduce((acc, current) => {
            const x = acc.find(item => item.movie_id === current.movie_id && item.type === current.type);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        // If total users are insufficient, fallback to user favorites and high-rated movies
        if (totalUsers <= 1) {
            res.json({
                recommendations: combinedIdsTypes,
                reason: "Fallback to user favorites and high-rated movies due to insufficient user data"
            });
            return;
        }

        // Find similar users based on favorite movies and high ratings
        const [similarUsersFavorites] = await pool.query('SELECT f2.user_id, f2.type FROM favorites f JOIN favorites f2 ON f.movie_id = f2.movie_id AND f.type = f2.type AND f.user_id != f2.user_id WHERE f.user_id = ? GROUP BY f2.user_id, f2.type', [userId]);
        const [similarUsersRatings] = await pool.query(`
            SELECT r2.user_id, r2.type FROM ratings r
            JOIN ratings r2 ON r.movie_id = r2.movie_id AND r.type = r2.type AND r.user_id != r2.user_id AND r.rating > 3 AND r2.rating > 3
            WHERE r.user_id = ?
            GROUP BY r2.user_id, r2.type
        `, [userId]);

        // Combine and filter duplicate similar user IDs and types
        let similarUserIdsTypes = [...similarUsersFavorites, ...similarUsersRatings];
        similarUserIdsTypes = similarUserIdsTypes.reduce((acc, current) => {
            const x = acc.find(item => item.user_id === current.user_id && item.type === current.type);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        // If similar users found, generate recommendations based on their preferences
        if (similarUserIdsTypes.length > 0) {
            let uniqueUserIds = similarUserIdsTypes.map(item => item.user_id);
            uniqueUserIds = [...new Set(uniqueUserIds)];
            const [recommendations] = await pool.query(`
                SELECT DISTINCT movie_id, type FROM (
                    SELECT movie_id, type FROM favorites WHERE user_id IN (?) 
                    UNION
                    SELECT movie_id, type FROM ratings WHERE user_id IN (?) AND rating > 3
                ) AS combined_movies WHERE movie_id NOT IN (
                    SELECT movie_id FROM favorites WHERE user_id = ?
                    UNION
                    SELECT movie_id FROM ratings WHERE user_id = ? AND rating > 3
                )
            `, [uniqueUserIds, uniqueUserIds, userId, userId]);
            res.json({ recommendations: recommendations });
        } else {
            // Fallback to user favorites and high-rated movies if no similar users found
            res.json({
                recommendations: combinedIdsTypes,
                reason: "fallback to user favorites and high-rated movies due to no similar users found"
            });
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
