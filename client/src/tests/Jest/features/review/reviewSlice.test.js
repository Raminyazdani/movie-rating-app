import reviewReducer, {
    fetchReviews,
    addReview,
    updateReview,
    removeReview,
} from '../../features/review/reviewSlice';
import { apiClient } from '../../api/clients/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('reviewSlice Reducer Test', () => {
    it('should return the initial state', () => {
        const initialState = {
            reviews: [],
            loading: false,
            error: null,
            message: null,
        };
        expect(reviewReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle fetchReviews.pending action', () => {
        const newState = reviewReducer(undefined, fetchReviews.pending());
        expect(newState.loading).toBe(true);
    });

    it('should handle fetchReviews.fulfilled action', () => {
        const reviews = [{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' }];
        const newState = reviewReducer(undefined, fetchReviews.fulfilled(reviews));
        expect(newState.reviews).toEqual(reviews);
        expect(newState.loading).toBe(false);
    });

    it('should handle fetchReviews.rejected action', () => {
        const errorMessage = 'Failed to fetch reviews';
        const newState = reviewReducer(undefined, fetchReviews.rejected({ message: errorMessage }));
        expect(newState.error).toEqual(errorMessage);
        expect(newState.loading).toBe(false);
    });

    it('should handle addReview.fulfilled action', () => {
        const reviews = [{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' }];
        const newState = reviewReducer(undefined, addReview.fulfilled(reviews));
        expect(newState.reviews).toEqual(reviews);
        expect(newState.message).toEqual('Review added successfully');
    });

    it('should handle updateReview.fulfilled action', () => {
        const reviews = [{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Updated review', type: 'movie' }];
        const newState = reviewReducer(undefined, updateReview.fulfilled(reviews));
        expect(newState.reviews).toEqual(reviews);
        expect(newState.message).toEqual('Review updated successfully');
    });

    it('should handle removeReview.fulfilled action', () => {
        const reviews = [{ id: 2, userId: 'user2', movieId: 'movie2', review: 'Some review', type: 'movie' }];
        const newState = reviewReducer(undefined, removeReview.fulfilled(reviews));
        expect(newState.reviews).toEqual(reviews);
        expect(newState.message).toEqual('Review removed successfully');
    });
});

jest.mock('../../api/clients/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({ data: [{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' }] })),
    post: jest.fn(() => Promise.resolve({ data: [{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' }] })),
    delete: jest.fn(() => Promise.resolve({ data: [{ id: 2, userId: 'user2', movieId: 'movie2', review: 'Some review', type: 'movie' }] })),
}));

const thunkAPI = {
    dispatch: jest.fn(),
    rejectWithValue: jest.fn(),
    fulfillWithValue: jest.fn(),
};

describe('reviewSlice Action Creator Test', () => {
    it('fetchReviews should dispatch correct actions on successful fetch', async () => {
        await fetchReviews({ userId: 'user1' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('addReview should dispatch correct actions on successful addition', async () => {
        await addReview({ userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('updateReview should dispatch correct actions on successful update', async () => {
        await updateReview({ userId: 'user1', movieId: 'movie1', review: 'Updated review', type: 'movie' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('removeReview should dispatch correct actions on successful removal', async () => {
        await removeReview({ userId: 'user2', movieId: 'movie2', type: 'movie' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Selector test
const selectReviews = (state) => state.reviews.reviews;

describe('reviewSlice Selector Test', () => {
    it('selectReviews should return the reviews from the state', () => {
        const state = { reviews: { reviews: [{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' }] } };
        expect(selectReviews(state)).toEqual([{ id: 1, userId: 'user1', movieId: 'movie1', review: 'Good movie', type: 'movie' }]);
    });
});

// Thunk test
describe('reviewSlice Thunk Test', () => {
    it('fetchReviews should dispatch correct actions on successful fetch', async () => {
        await fetchReviews({ userId: 'user1' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});
