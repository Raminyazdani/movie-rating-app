import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import favoritesReducer from '../features/favorite/favoriteSlice';
import ratingsReducer from '../features/rating/ratingSlice';
import userReducer from '../features/user/userSlice';
import reviewsReducer from '../features/review/reviewSlice'; // Import the reviewSlice reducer
import RecommendationSlice from '../features/recommendation/recommendationSlice'; // Import the reviewSlice reducer

const store = configureStore({
    reducer: {
        auth: authReducer,
        favorites: favoritesReducer,
        ratings: ratingsReducer,
        user: userReducer,
        reviews: reviewsReducer,
        recommendations: RecommendationSlice,
// Add the reviews reducer here
    },
});

export default store;
