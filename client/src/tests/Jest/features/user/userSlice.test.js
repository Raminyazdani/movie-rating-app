import userReducer, { fetchUserId, createUser } from '../../features/user/userSlice';
import { apiClient } from '../../api/clients/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('userSlice Reducer Test', () => {
    it('should return the initial state', () => {
        const initialState = {
            userId: null,
        };
        expect(userReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle fetchUserId.fulfilled action', () => {
        const userId = '123456789';
        const newState = userReducer(undefined, fetchUserId.fulfilled(userId));
        expect(newState.userId).toEqual(userId);
    });
});

jest.mock('../../api/clients/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({ data: [{ id: '123456789' }] })),
    post: jest.fn(() => Promise.resolve({ data: { userId: '987654321' } })),
}));

const thunkAPI = {
    dispatch: jest.fn(),
    rejectWithValue: jest.fn(),
    fulfillWithValue: jest.fn(),
};

describe('userSlice Action Creator Test', () => {
    it('fetchUserId should dispatch correct actions on successful fetch', async () => {
        await fetchUserId('test@example.com')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });

    it('createUser should dispatch correct actions on successful user creation', async () => {
        await createUser('test@example.com')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Selector test
const selectUserId = (state) => state.user.userId;

describe('userSlice Selector Test', () => {
    it('selectUserId should return the userId from the state', () => {
        const state = { user: { userId: '123456789' } };
        expect(selectUserId(state)).toEqual('123456789');
    });
});

// Thunk test
describe('userSlice Thunk Test', () => {
    it('fetchUserId should dispatch correct actions on successful fetch', async () => {
        await fetchUserId('test@example.com')(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});
