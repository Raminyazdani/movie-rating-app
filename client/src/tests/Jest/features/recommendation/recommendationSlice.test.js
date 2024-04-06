import recommendationReducer, {
    fetchRecommendations,
    clearRecommendations,
} from '../../features/recommendation/recommendationSlice';
import { apiClient } from '../../api/clients/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('recommendationSlice Reducer Test', () => {
    it('should return the initial state', () => {
        const initialState = {
            recommendations: [],
            loading: false,
            error: null,
            reason: "",
        };
        expect(recommendationReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle fetchRecommendations.pending action', () => {
        const newState = recommendationReducer(undefined, fetchRecommendations.pending());
        expect(newState.loading).toBe(true);
    });

    it('should handle fetchRecommendations.fulfilled action', () => {
        const recommendations = [{ id: 1, name: 'Movie 1' }, { id: 2, name: 'Movie 2' }];
        const newState = recommendationReducer(undefined, fetchRecommendations.fulfilled(recommendations, 'Recommended based on user history'));
        expect(newState.recommendations).toEqual(recommendations);
        expect(newState.loading).toBe(false);
        expect(newState.reason).toEqual('Recommended based on user history');
    });

    it('should handle fetchRecommendations.rejected action', () => {
        const errorMessage = 'Failed to fetch recommendations';
        const newState = recommendationReducer(undefined, fetchRecommendations.rejected({ message: errorMessage }));
        expect(newState.error).toEqual(errorMessage);
        expect(newState.loading).toBe(false);
    });

    it('should handle clearRecommendations action', () => {
        const state = {
            recommendations: [{ id: 1, name: 'Movie 1' }, { id: 2, name: 'Movie 2' }],
            loading: false,
            error: null,
            reason: 'Recommended based on user history',
        };
        const newState = recommendationReducer(state, clearRecommendations());
        expect(newState.recommendations).toEqual([]);
        expect(newState.loading).toBe(false);
        expect(newState.error).toBeNull();
        expect(newState.reason).toEqual('');
    });
});

jest.mock('../../api/clients/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({ data: { recommendations: [{ id: 1, name: 'Movie 1' }, { id: 2, name: 'Movie 2' }] } })),
}));

const thunkAPI = {
    dispatch: jest.fn(),
    rejectWithValue: jest.fn(),
    fulfillWithValue: jest.fn(),
};

describe('recommendationSlice Action Creator Test', () => {
    it('fetchRecommendations should dispatch correct actions on successful fetch', async () => {
        await fetchRecommendations('testUserId')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('clearRecommendations should dispatch correct action', () => {
        clearRecommendations()(thunkAPI.dispatch);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Selector test
const selectRecommendations = (state) => state.recommendations.recommendations;

describe('recommendationSlice Selector Test', () => {
    it('selectRecommendations should return the recommendations from the state', () => {
        const state = { recommendations: { recommendations: [{ id: 1, name: 'Movie 1' }, { id: 2, name: 'Movie 2' }] } };
        expect(selectRecommendations(state)).toEqual([{ id: 1, name: 'Movie 1' }, { id: 2, name: 'Movie 2' }]);
    });
});

// Thunk test
describe('recommendationSlice Thunk Test', () => {
    it('fetchRecommendations should dispatch correct actions on successful fetch', async () => {
        await fetchRecommendations('testUserId')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Integration test can be added if necessary
