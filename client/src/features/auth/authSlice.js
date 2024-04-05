import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {auth, googleProvider} from '../../config/firebase-config';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import axios from 'axios';
import {apiClient} from "../../config/apiClient";


const checkUserInDatabase = async (email) => {
    try {
        const response = await apiClient.get(`/api/checkUser/${email}`);
        return response.data.exists;
    } catch (error) {
        console.error('Error checking user in database', error);
        return error;
    }
};


export const loginUserWithGoogle = createAsyncThunk(
    'auth/loginUserWithGoogle',
    async (_, thunkAPI) => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            const email = user.email;


            const userExists = await checkUserInDatabase(email);
            if (!userExists) {

                await apiClient.post('/api/createUser', {email});
            }

            return user;
        } catch (error) {
            console.error('Error in loginUserWithGoogle', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);


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

                await apiClient.post('/api/createUser', {email});
            }

            return userData;
        } catch (error) {
            console.error('Error in loginUserWithEmailPassword', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);


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

                await apiClient.post('/api/createUser', {email});
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


export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
        await signOut(auth);
        window.location.reload()
        return thunkAPI.fulfillWithValue(null);
    } catch (error) {
        console.error('Error in logoutUser', error);
        return thunkAPI.rejectWithValue(error);
    }
});

const initialState = {
    user: null,
    status: 'idle',
    error: null,
    snackbar: {
        open: false,
        message: '',
        severity: 'info',
    },
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
            state.snackbar = {open: true, message: 'User set successfully.', severity: 'success'};
        },
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle';
            state.snackbar = {open: true, message: 'User cleared.', severity: 'info'};
        },
        setSnackbar: (state, action) => {
            state.snackbar = action.payload;
        },
    },
    extraReducers: (builder) => {
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

export const {setUser, clearUser, setSnackbar} = authSlice.actions;
export default authSlice.reducer;
