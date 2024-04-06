import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "../../api/clients/apiClient";

/**
 * Async thunk to fetch ratings for a given user.
 * @param {string} userId - The ID of the user whose ratings are to be fetched.
 * @returns {Promise<Object>} A promise that resolves with the user's ratings.
 */
export const fetchRatings = createAsyncThunk(
    'ratings/fetchRatings',
    async (userId, thunkAPI) => {
        const response = await apiClient.get(`/api/ratings/${userId}`);
        return response.data;
    }
);

/**
 * Async thunk to add a new rating for a movie or TV show.
 * @param {Object} params - The parameters for the rating to add, including userId, imdbId, rating, and type.
 * @returns {Promise<Object>} A promise that resolves with the newly added rating.
 */
export const addRating = createAsyncThunk(
    'ratings/addRating',
    async ({userId, imdbId, rating, type}, thunkAPI) => {
        const response = await apiClient.post(`/api/ratings`, {userId, movieId: imdbId, rating, type});
        return response.data;
    }
);

/**
 * Async thunk to remove a rating for a movie or TV show.
 * @param {Object} params - The parameters for the rating to remove, including userId, imdbId, and type.
 * @returns {Promise<Object>} A promise that resolves with the data of the removed rating.
 */
export const removeRating = createAsyncThunk(
    'ratings/removeRating',
    async ({userId, imdbId, type}, thunkAPI) => {
        const response = await apiClient.delete(`/api/ratings/${userId}/${imdbId}/${type}`);
        return response.data;
    }
);

// The ratings slice, managing the state related to ratings.
const ratingsSlice = createSlice({
    name: 'ratings',
    initialState: {
        ratings: [], // Array of ratings
        loading: false, // Boolean to indicate loading state
        error: null, // Error message in case of a failed action
        message: null // Success message after an action is completed
    },
    reducers: {
        // Reducers to handle other ratings-related actions could be defined here
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.pending, (state) => {
                // Indicates that the fetch operation has started
                state.loading = true;
            })
            .addCase(fetchRatings.fulfilled, (state, action) => {
                // Updates the state with the fetched ratings
                state.ratings = action.payload;
                state.loading = false;
            })
            .addCase(fetchRatings.rejected, (state, action) => {
                // Updates the state to indicate the fetch operation has failed
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addRating.fulfilled, (state, action) => {
                // Updates the state with the new rating and shows a success message
                state.ratings = action.payload;
                state.message = 'Rating added successfully';
            })
            .addCase(removeRating.fulfilled, (state, action) => {
                // Updates the state by removing the specified rating and shows a success message
                state.ratings = action.payload;
                state.message = 'Rating removed successfully';
            });
    }
});

export default ratingsSlice.reducer;
