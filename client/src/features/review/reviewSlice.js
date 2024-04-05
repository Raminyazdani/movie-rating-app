import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "../../config/apiClient";


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



export const addReview = createAsyncThunk(
    'reviews/addReview',
    async ({ userId, movieId, review,type }, thunkAPI) => {
        const response = await apiClient.post(`/api/reviews`, { userId, movieId, review,type });

        return response.data
    }
);



export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ userId, movieId, review ,type }, thunkAPI) => {

        const response = await apiClient.post(`/api/reviews`, { userId, movieId, review,type });
        return response.data;
    }
);


export const removeReview = createAsyncThunk(
    'reviews/removeReview',
    async ({ userId, movieId ,type}, thunkAPI) => {

        const response = await apiClient.delete(`/api/reviews/${userId}/${movieId}/${type}`);
        return response.data
    }
);
const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [], 
        loading: false,
        error: null,
        message: null
    },
    reducers: {},
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
                state.reviews =action.payload 
                state.message = 'Review added successfully';
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.reviews =action.payload 
                state.message = 'Review updated successfully';
            })
            .addCase(removeReview.fulfilled, (state, action) => {
                state.reviews =action.payload 
                state.message = 'Review removed successfully';
            });
    }
});

export default reviewsSlice.reducer;
