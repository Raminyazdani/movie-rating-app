import {
    loginUserWithGoogle,
    loginUserWithEmailPassword,
    signupUserWithEmailPassword,
    logoutUser,
    setUser,
    clearUser,
    setSnackbar,
} from '../../features/auth/authSlice';
import authReducer, { initialState } from '../../features/auth/authSlice';
import { apiClient } from '../../api/clients/apiClient';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

describe('authSlice Reducer Test', () => {
    it('should return the initial state', () => {
        expect(authReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle setUser action', () => {
        const user = { uid: 'testUid', email: 'test@example.com' };
        const newState = authReducer(initialState, setUser(user));
        expect(newState.user).toEqual(user);
        expect(newState.status).toEqual('succeeded');
    });

    it('should handle clearUser action', () => {
        const newState = authReducer(initialState, clearUser());
        expect(newState.user).toBeNull();
        expect(newState.status).toEqual('idle');
    });

    it('should handle setSnackbar action', () => {
        const snackbar = { open: true, message: 'Test message', severity: 'success' };
        const newState = authReducer(initialState, setSnackbar(snackbar));
        expect(newState.snackbar).toEqual(snackbar);
    });
});

jest.mock('../../api/clients/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({ data: { exists: true } })),
    post: jest.fn(() => Promise.resolve()),
}));
jest.mock('firebase/auth', () => ({
    signInWithPopup: jest.fn(() => Promise.resolve({ user: { email: 'test@example.com' } })),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { email: 'test@example.com' } })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { email: 'test@example.com' } })),
    signOut: jest.fn(() => Promise.resolve()),
}));

describe('authSlice Action Creator Test', () => {
    const thunkAPI = {
        dispatch: jest.fn(),
        rejectWithValue: jest.fn(),
        fulfillWithValue: jest.fn(),
    };

    it('loginUserWithGoogle should dispatch correct actions on successful login', async () => {
        await loginUserWithGoogle()(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(2);
    });

    it('loginUserWithEmailPassword should dispatch correct actions on successful login', async () => {
        await loginUserWithEmailPassword({ email: 'test@example.com', password: 'password' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(2);
    });

    it('signupUserWithEmailPassword should dispatch correct actions on successful signup', async () => {
        await signupUserWithEmailPassword({ email: 'test@example.com', password: 'password' })(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(2);
    });

    it('logoutUser should dispatch correct actions on successful logout', async () => {
        await logoutUser()(thunkAPI.dispatch, jest.fn(), null);
        expect(thunkAPI.dispatch).toHaveBeenCalledTimes(1);
    });
});

const selectUser = (state) => state.auth.user;

describe('authSlice Selector Test', () => {
    it('selectUser should return the user from the state', () => {
        const user = { uid: 'testUid', email: 'test@example.com' };
        const state = { auth: { user } };
        expect(selectUser(state)).toEqual(user);
    });
});

const store = {
    getState: jest.fn(() => ({ auth: initialState })),
    dispatch: jest.fn(),
};

describe('authSlice Thunk Test', () => {
    it('logoutUser should dispatch correct actions on successful logout', async () => {
        await logoutUser()(store.dispatch, store.getState, null);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
});

// Integration tests can be added if necessary
