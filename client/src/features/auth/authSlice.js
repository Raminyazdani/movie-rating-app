import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, googleProvider } from '../../config/firebase-config';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { apiClient } from "../../api/clients/apiClient";

/**
 * Helper function to check if a user exists in the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the user exists, false otherwise.
 */
const checkUserInDatabase = async (email) => {
    try {
        const response = await apiClient.get(`/api/users/checkUser/${email}`);
        return response.data.exists;
    } catch (error) {
        console.error('Error checking user in database', error);
        return error;
    }
};

/**
 * Logs in the user using Google authentication.
 * If the user does not exist in the database, it creates a new user.
 * @returns {Promise<Object>} A promise that resolves with the user object on successful authentication.
 */
export const loginUserWithGoogle = createAsyncThunk(
    'auth/loginUserWithGoogle',
    async (_, thunkAPI) => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            const email = user.email;

            const userExists = await checkUserInDatabase(email);
            if (!userExists) {
                await apiClient.post('/api/users/createUser', {email});
            }

            return user;
        } catch (error) {
            console.error('Error in loginUserWithGoogle', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

/**
 * Logs in the user using email and password.
 * If the user does not exist in the database, it creates a new user.
 * @param {Object} credentials - An object containing the user's email and password.
 * @returns {Promise<Object>} A promise that resolves with the user object on successful authentication.
 */
export const loginUserWithEmailPassword = createAsyncThunk(
    'auth/loginUserWithEmailPassword',
    async ({email, password}, thunkAPI) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                email: user.email,
            };

            const userExists = await checkUserInDatabase(email);
            if (!userExists) {
                await apiClient.post('/api/users/createUser', {email});
            }

            return userData;
        } catch (error) {
            console.error('Error in loginUserWithEmailPassword', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

/**
 * Signs up the user using email and password.
 * Creates a new user in the authentication system and the database.
 * @param {Object} credentials - An object containing the user's email and password.
 * @returns {Promise<Object>} A promise that resolves with the user object on successful signup.
 */
export const signupUserWithEmailPassword = createAsyncThunk(
    'auth/signupUserWithEmailPassword',
    async ({email, password}, thunkAPI) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                email: user.email,
            };

            const userExists = await checkUserInDatabase(email);
            if (!userExists) {
                await apiClient.post('/api/users/createUser', {email});
            }

            return userData;
        } catch (error) {
            console.error('Error in signupUserWithEmailPassword', error);
            const errorData = {
                code: error.code,
                message: error.message,
            };
            return thunkAPI.rejectWithValue(errorData);
        }
    }
);

/**
 * Logs out the current user and reloads the window to reflect the change in user state.
 * @returns {Promise<void>} A promise that resolves once the user is logged out.
 */
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
        await signOut(auth);
        window.location.reload();
        return thunkAPI.fulfillWithValue(null);
    } catch (error) {
        console.error('Error in logoutUser', error);
        return thunkAPI.rejectWithValue(error);
    }
});

// Initial state for the auth slice
const initialState = {
    user: null, // Currently authenticated user
    status: 'idle', // Loading state ('idle', 'loading', 'succeeded', 'failed')
    error: null, // Error information on failed authentication attempt
    snackbar: { // Snackbar information for displaying messages
        open: false,
        message: '',
        severity: 'info',
    },
};

// Slice for authentication-related state and actions
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Sets the current user and updates the status and snackbar state
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
            state.snackbar = {open: true, message: 'User set successfully.', severity: 'success'};
        },
        // Clears the current user and resets the state
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle';
            state.snackbar = {open: true, message: 'User cleared.', severity: 'info'};
        },
        // Sets the snackbar state with provided payload
        setSnackbar: (state, action) => {
            state.snackbar = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Handles authentication state changes based on async actions
        builder
            .addCase(loginUserWithGoogle.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
                state.snackbar = {open: true, message: 'Logged in successfully with Google.', severity: 'success'};
            })
            .addCase(loginUserWithEmailPassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
                state.snackbar = {
                    open: true,
                    message: 'Logged in successfully with email and password.',
                    severity: 'success'
                };
            })
            .addCase(signupUserWithEmailPassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
                state.snackbar = {open: true, message: 'Signed up and logged in successfully.', severity: 'success'};
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
                state.snackbar = {open: true, message: 'Logged out successfully.', severity: 'info'};
            })
            // Handles rejected state for all auth related actions
            .addMatcher(
                (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.error = action.error.message;
                    state.status = 'failed';
                    state.snackbar = {
                        open: true,
                        message: 'An error occurred: ' + action.payload.message,
                        severity: 'error'
                    };
                }
            );
    },
});

// Export actions and reducer
export const { setUser, clearUser, setSnackbar } = authSlice.actions;
export default authSlice.reducer;
