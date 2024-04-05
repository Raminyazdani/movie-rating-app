import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiClient} from "../../config/apiClient";


export const createUser = createAsyncThunk(
    'user/createUser',
    async (email, {rejectWithValue}) => {
        try {
            const response = await apiClient.post('/api/createUser', {email});
            
            return response.data.userId;
        } catch (error) {
            console.error('Error creating user:', error);
            
            return rejectWithValue(error.response.data);
        }
    }
);


export const fetchUserId = createAsyncThunk(
    'user/fetchUserId',
    async (email, {dispatch}) => {
        try {
            const response = await apiClient.get(`/api/getUserId/${email}`);
            let userId = response.data[0]?.id; 

            
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


const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserId.fulfilled, (state, action) => {
            state.userId = action.payload; 
        });
        
    }
});

export default userSlice.reducer;
