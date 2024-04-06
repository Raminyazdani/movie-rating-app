import ratingReducer, {
    fetchRatings,
    addRating,
    removeRating,
} from '../../features/rating/ratingSlice';
import { apiClient } from '../../api/clients/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('ratingSlice Reducer Test', () => {
    it('should return the initial state', () => {
        const initialState = {
            ratings: [],
            loading: false,
            error: null,
            message: null,
        };
        expect(ratingReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle fetchRatings.pending action', () => {
        const newState = ratingReducer(undefined, fetchRatings.pending());
        expect(newState.loading).toBe(true);
    });

    it('should handle fetchRatings.fulfilled action', () => {
        const ratings = [{ id: 1, rating: 4 }, { id: 2, rating: 3 }];
        const newState = ratingReducer(undefined, fetchRatings.fulfilled(ratings));
        expect(newState.ratings).toEqual(ratings);
        expect(newState.loading).toBe(false);
    });

    it('should handle fetchRatings.rejected action', () => {
        const errorMessage = 'Failed to fetch ratings';
        const newState = ratingReducer(undefined, fetchRatings.rejected(new Error(errorMessage)));
        expect(newState.error).toEqual(errorMessage);
        expect(newState.loading).toBe(false);
    });

    it('should handle addRating.fulfilled action', () => {
        const ratings = [{ id: 1, rating: 4 }];
        const newState = ratingReducer(undefined, addRating.fulfilled(ratings));
        expect(newState.ratings).toEqual(ratings);
        expect(newState.message).toEqual('Rating added successfully');
    });

    it('should handle removeRating.fulfilled action', () => {
        const ratings = [];
        const newState = ratingReducer(undefined, removeRating.fulfilled(ratings));
        expect(newState.ratings).toEqual(ratings);
        expect(newState.message).toEqual('Rating removed successfully');
    });
});

jest.mock('../../api/clients/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({ data: [{ id: 1, rating: 4 }, { id: 2, rating: 3 }] })),
    post: jest.fn(() => Promise.resolve({ data: [{ id: 1, rating: 4 }] })),
    delete: jest.fn(() => Promise.resolve({ data: [] })),
}));

const thunkAPI = {
    dispatch: jest.fn(),
    rejectWithValue: jest.fn(),
    fulfillWithValue: jest.fn(),
};

describe('ratingSlice Action Creator Test', () => {
    it('fetchRatings should dispatch correct actions on successful fetch', async () => {
        await fetchRatings('testUserId')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('addRating should dispatch correct actions on successful add', async () => {
        await addRating({ userId: 'testUserId', imdbId: '123', rating: 5, type: 'movie' })(
            thunkAPI.dispatch,
            jest.fn(),
            null
        );
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('removeRating should dispatch correct actions on successful remove', async () => {
        await removeRating({ userId: 'testUserId', imdbId: '123', type: 'movie' })(
            thunkAPI.dispatch,
            jest.fn(),
            null
        );
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Selector test
const selectRatings = (state) => state.ratings.ratings;

describe('ratingSlice Selector Test', () => {
    it('selectRatings should return the ratings from the state', () => {
        const state = { ratings: { ratings: [{ id: 1, rating: 4 }, { id: 2, rating: 3 }] } };
        expect(selectRatings(state)).toEqual([{ id: 1, rating: 4 }, { id: 2, rating: 3 }]);
    });
});

// Thunk test
describe('ratingSlice Thunk Test', () => {
    it('fetchRatings should dispatch correct actions on successful fetch', async () => {
        await fetchRatings('testUserId')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Integration test can be added if necessary
