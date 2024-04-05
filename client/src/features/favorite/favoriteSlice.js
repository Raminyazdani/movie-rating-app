

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiClient} from "../../config/apiClient";


export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (userId, thunkAPI) => {
        const response = await apiClient.get(`/api/favorites/${userId}`);
        return response.data;
    }
);


export const likeMovie = createAsyncThunk(
    'favorites/likeMovie',
    async ({userId, imdbId, type}, thunkAPI) => {
        const response = await apiClient.post(`/api/favorites`, {userId, imdbId ,type});
        return response.data
    }
);


export const unlikeMovie = createAsyncThunk(
    'favorites/unlikeMovie',
    async ({userId, imdbId, type}, thunkAPI) => {
        const response = await apiClient.delete(`/api/favorites/${userId}/${imdbId}/${type}`);

        return response.data;
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],
        loading: false,
        error: null,
        message: null 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {

                state.loading = true;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {

                state.items = action.payload;

                state.loading = false;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;

                state.error = action.error.message;
            })
            .addCase(likeMovie.fulfilled, (state, action) => {

                state.items = action.payload; 

                state.message = 'Movie added to favorites successfully'; 
            })
            .addCase(unlikeMovie.fulfilled, (state, action) => {
                state.items = action.payload; 

                state.message = 'Movie removed from favorites successfully'; 
            });
    }
});

export default favoritesSlice.reducer;
