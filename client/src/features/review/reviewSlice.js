import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "../../api/clients/apiClient";

/**
 * Fetches reviews based on the provided userId and/or movieId.
 * If no parameters are provided, it fetches all reviews.
 */
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async ({ userId, movieId } = {}, thunkAPI) => {
        const queryParams = new URLSearchParams();
        if (userId) queryParams.append('userId', userId);
        if (movieId) queryParams.append('movieId', movieId);
        const response = await apiClient.get(`/api/reviews?${queryParams}`);
        return response.data;
    }
);

/**
 * Adds a new review for a movie by a user.
 */
export const addReview = createAsyncThunk(
    'reviews/addReview',
    async ({ userId, movieId, review, type }, thunkAPI) => {
        const response = await apiClient.post(`/api/reviews`, { userId, movieId, review, type });
        return response.data;
    }
);

/**
 * Updates an existing review for a movie by a user.
 */
export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ userId, movieId, review, type }, thunkAPI) => {
        const response = await apiClient.post(`/api/reviews`, { userId, movieId, review, type });
        return response.data;
    }
);

/**
 * Removes a review for a movie by a user.
 */
export const removeReview = createAsyncThunk(
    'reviews/removeReview',
    async ({ userId, movieId, type }, thunkAPI) => {
        const response = await apiClient.delete(`/api/reviews/${userId}/${movieId}/${type}`);
        return response.data;
    }
);

/**
 * The reviews slice manages the state related to movie reviews,
 * including the operations to fetch, add, update, and remove reviews.
 */
const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [], // The list of reviews
        loading: false, // Loading state
        error: null, // Error message for failed operations
        message: null // Success message for operations
    },
    reducers: {
        // Potential reducers for synchronous operations on reviews could be added here
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.loading = false;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.message = 'Review added successfully';
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.message = 'Review updated successfully';
            })
            .addCase(removeReview.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.message = 'Review removed successfully';
            });
    }
});

export default reviewsSlice.reducer;
