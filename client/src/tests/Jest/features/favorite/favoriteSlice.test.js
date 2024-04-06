import favoriteReducer, {
    fetchFavorites,
    likeMovie,
    unlikeMovie,
} from '../../features/favorite/favoriteSlice';
import { apiClient } from '../../api/clients/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('favoriteSlice Reducer Test', () => {
    it('should return the initial state', () => {
        const initialState = {
            items: [],
            loading: false,
            error: null,
            message: null,
        };
        expect(favoriteReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle fetchFavorites.pending action', () => {
        const newState = favoriteReducer(undefined, fetchFavorites.pending());
        expect(newState.loading).toBe(true);
    });

    it('should handle fetchFavorites.fulfilled action', () => {
        const movies = [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }];
        const newState = favoriteReducer(undefined, fetchFavorites.fulfilled(movies));
        expect(newState.items).toEqual(movies);
        expect(newState.loading).toBe(false);
    });

    it('should handle fetchFavorites.rejected action', () => {
        const errorMessage = 'Failed to fetch favorites';
        const newState = favoriteReducer(undefined, fetchFavorites.rejected(new Error(errorMessage)));
        expect(newState.error).toEqual(errorMessage);
        expect(newState.loading).toBe(false);
    });

    it('should handle likeMovie.fulfilled action', () => {
        const movies = [{ id: 1, title: 'Movie 1' }];
        const newState = favoriteReducer(undefined, likeMovie.fulfilled(movies));
        expect(newState.items).toEqual(movies);
        expect(newState.message).toEqual('Movie added to favorites successfully');
    });

    it('should handle unlikeMovie.fulfilled action', () => {
        const movies = [];
        const newState = favoriteReducer(undefined, unlikeMovie.fulfilled(movies));
        expect(newState.items).toEqual(movies);
        expect(newState.message).toEqual('Movie removed from favorites successfully');
    });
});

jest.mock('../../api/clients/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({ data: [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }] })),
    post: jest.fn(() => Promise.resolve({ data: [{ id: 1, title: 'Movie 1' }] })),
    delete: jest.fn(() => Promise.resolve({ data: [] })),
}));

const thunkAPI = {
    dispatch: jest.fn(),
    rejectWithValue: jest.fn(),
    fulfillWithValue: jest.fn(),
};

describe('favoriteSlice Action Creator Test', () => {
    it('fetchFavorites should dispatch correct actions on successful fetch', async () => {
        await fetchFavorites()(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('likeMovie should dispatch correct actions on successful like', async () => {
        await likeMovie({ userId: 'testUserId', imdbId: '123', type: 'movie' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('unlikeMovie should dispatch correct actions on successful unlike', async () => {
        await unlikeMovie({ userId: 'testUserId', imdbId: '123', type: 'movie' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Selector test
const selectFavorites = (state) => state.favorites.items;

describe('favoriteSlice Selector Test', () => {
    it('selectFavorites should return the favorite movies from the state', () => {
        const state = { favorites: { items: [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }] } };
        expect(selectFavorites(state)).toEqual([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);
    });
});

// Thunk test
describe('favoriteSlice Thunk Test', () => {
    it('fetchFavorites should dispatch correct actions on successful fetch', async () => {
        await fetchFavorites()(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Integration test can be added if necessary
