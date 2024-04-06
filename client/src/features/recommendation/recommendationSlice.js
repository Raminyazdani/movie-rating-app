import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from "../../api/clients/apiClient";

/**
 * Async thunk for fetching recommendations for a given user.
 * This action sends a GET request to fetch recommended items based on the user's ID.
 * @param {string} userId - The ID of the user for whom recommendations are to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of recommended items.
 */
export const fetchRecommendations = createAsyncThunk(
    'recommendations/fetchRecommendations',
    async (userId, thunkAPI) => {
        try {
            const response = await apiClient.get(`/api/recommendations/${userId}`);
            // Assuming the API returns an object with a 'recommendations' array
            return response.data.recommendations;
        } catch (error) {
            // In case of an error, reject the promise and pass the error data for further handling
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Defines the initial state of the recommendations slice
const initialState = {
    recommendations: [], // The list of fetched recommendations
    loading: false,      // Loading state to indicate when fetching is in progress
    error: null,         // Error state to capture any errors that occur during fetching
    reason: ""           // Additional reason for the recommendation, can be used to provide more context
};

// The recommendations slice that manages the state and actions related to recommendations
const recommendationSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {
        // Action to clear all recommendations and reset the state
        clearRecommendations: (state) => {
            state.recommendations = [];
            state.loading = false;
            state.error = null;
            state.reason = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle the pending state of fetching recommendations
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
            })
            // Handle successfully fetched recommendations
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
                state.loading = false;
                // Optional: use action.reason to provide additional context if available
                state.reason = action.reason || "";
            })
            // Handle errors that occur during the fetching process
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                // Capture the error message or provide a default message
                state.error = action.error.message || "Could not fetch recommendations";
            });
    }
});

// Export the clearRecommendations action for use in the application
export const { clearRecommendations } = recommendationSlice.actions;

// Export the reducer as the default export of this module
export default recommendationSlice.reducer;
