import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {apiClient} from "../../config/apiClient";


export const fetchRecommendations = createAsyncThunk(
    'recommendations/fetchRecommendations',
    async (userId, thunkAPI) => {
        try {
            const response = await apiClient.get(`/api/recommendations/${userId}`);
            return response.data.recommendations;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


const initialState = {
    recommendations: [],
    loading: false,
    error: null,
    reason: "" 
};


const recommendationSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {
        clearRecommendations: (state) => {
            state.recommendations = [];
            state.loading = false;
            state.error = null;
            state.reason = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
                state.loading = false;
                state.reason = action.reason || ""; 
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Could not fetch recommendations";
            });
    }
});

export const {clearRecommendations} = recommendationSlice.actions;

export default recommendationSlice.reducer;
