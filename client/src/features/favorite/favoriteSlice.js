import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "../../api/clients/apiClient";

/**
 * Fetches the list of favorite movies for a specific user.
 * @param {string} userId - The ID of the user whose favorites are to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of favorite movies.
 */
export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (userId, thunkAPI) => {
        const response = await apiClient.get(`/api/favorites/${userId}`);
        return response.data;
    }
);

/**
 * Adds a movie to the user's list of favorites.
 * @param {Object} params - Parameters including userId, imdbId of the movie, and its type.
 * @returns {Promise<Object>} A promise that resolves with the updated list of favorites.
 */
export const likeMovie = createAsyncThunk(
    'favorites/likeMovie',
    async ({userId, imdbId, type}, thunkAPI) => {
        const response = await apiClient.post(`/api/favorites`, {userId, imdbId, type});
        return response.data;
    }
);

/**
 * Removes a movie from the user's list of favorites.
 * @param {Object} params - Parameters including userId, imdbId of the movie, and its type.
 * @returns {Promise<Object>} A promise that resolves with the updated list of favorites.
 */
export const unlikeMovie = createAsyncThunk(
    'favorites/unlikeMovie',
    async ({userId, imdbId, type}, thunkAPI) => {
        const response = await apiClient.delete(`/api/favorites/${userId}/${imdbId}/${type}`);
        return response.data;
    }
);

// Slice for managing favorites related state and actions.
const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [], // List of favorite items
        loading: false, // Loading state indicator
        error: null, // Error message for failed operations
        message: null // Success message for operations
    },
    reducers: {
        // Define any reducers for synchronous actions related to favorites here.
    },
    extraReducers: (builder) => {
        builder
            // Handles the loading state when fetching favorites
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
            })
            // Updates the state with fetched favorites once the operation is successful
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            // Handles any errors that occur during the fetch operation
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Updates the state when a movie is successfully added to favorites
            .addCase(likeMovie.fulfilled, (state, action) => {
                state.items = action.payload;
                state.message = 'Movie added to favorites successfully';
            })
            // Updates the state when a movie is successfully removed from favorites
            .addCase(unlikeMovie.fulfilled, (state, action) => {
                state.items = action.payload;
                state.message = 'Movie removed from favorites successfully';
            });
    }
});

export default favoritesSlice.reducer;
