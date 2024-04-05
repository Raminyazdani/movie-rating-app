import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiClient} from "../../config/apiClient";


export const fetchRatings = createAsyncThunk(
    'ratings/fetchRatings',
    async (userId, thunkAPI) => {
        const response = await apiClient.get(`/api/ratings/${userId}`);
        return response.data; 
    }
);


export const addRating = createAsyncThunk(
    'ratings/addRating',
    async ({userId, imdbId, rating, type}, thunkAPI) => {
        const response = await apiClient.post(`/api/ratings`, {userId, movieId: imdbId, rating, type});
        return response.data; 
    }
);


export const removeRating = createAsyncThunk(
    'ratings/removeRating',
    async ({userId, imdbId, type}, thunkAPI) => {

        const response = await apiClient.delete(`/api/ratings/${userId}/${imdbId}/${type}`);
        return response.data; 
    }
);

const ratingsSlice = createSlice({
    name: 'ratings',
    initialState: {
        ratings: [], 
        loading: false,
        error: null,
        message: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRatings.fulfilled, (state, action) => {
                
                state.ratings = action.payload;
                state.loading = false;
            })
            .addCase(fetchRatings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addRating.fulfilled, (state, action) => {
                state.ratings = action.payload
                state.message = 'Rating added successfully';
            })

            .addCase(removeRating.fulfilled, (state, action) => {

                
                state.ratings = action.payload
                state.message = 'Rating removed successfully';
            })

    }

});

export default ratingsSlice.reducer;
