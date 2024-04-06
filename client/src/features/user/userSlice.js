import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "../../api/clients/apiClient";

/**
 * Async thunk for creating a new user.
 * This action sends a POST request to the backend to create a new user with the provided email.
 * @param {string} email - The email address for the new user.
 * @returns {Promise<string>} A promise that resolves to the user ID of the newly created user.
 */
export const createUser = createAsyncThunk(
    'user/createUser',
    async (email, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/users/createUser', { email });

            // Assuming the API returns the userId in the response data
            return response.data.userId;
        } catch (error) {
            console.error('Error creating user:', error);

            // Properly handle and forward the error as a rejected action
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Async thunk for fetching a user ID by email.
 * If the user does not exist, it attempts to create a new user.
 * @param {string} email - The email address to fetch or create a user for.
 * @returns {Promise<string>} A promise that resolves to the user ID.
 */
export const fetchUserId = createAsyncThunk(
    'user/fetchUserId',
    async (email, { dispatch }) => {
        try {
            const response = await apiClient.get(`/api/users/getUserId/${email}`);
            let userId = response.data[0]?.id;

            // If the user ID wasn't found, create a new user
            if (!userId) {
                const createUserResponse = await dispatch(createUser(email));

                if (createUserResponse.meta.requestStatus === 'fulfilled') {
                    userId = createUserResponse.payload;
                } else {
                    throw new Error('Failed to create user');
                }
            }

            return userId;
        } catch (error) {
            console.error('Error fetching or creating user ID:', error);
            throw error;
        }
    }
);

// Defines the user slice with an initial state and reducers to handle actions
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
    },
    reducers: {
        // Reducers for other user-related actions could be defined here
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserId.fulfilled, (state, action) => {
            // Update state with the fetched or created user ID
            state.userId = action.payload;
        });
    }
});

export default userSlice.reducer;
