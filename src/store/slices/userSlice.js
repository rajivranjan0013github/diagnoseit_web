import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser, updateUser as updateUserAPI, useHeart as useHeartAPI } from '@/lib/api';
import { submitCurrentGameplay } from './gameSlice';

// Try to load user from localStorage
const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
    userData: initialUser,
    isPremium: initialUser?.isPremium ?? false,
    hearts: initialUser?.hearts ?? 5,
    status: 'idle',
    error: null,
};

// Async thunks
export const getUser = createAsyncThunk(
    'user/getUser',
    async (userId, { rejectWithValue }) => {
        try {
            const user = await fetchUser(userId);
            return user;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const user = await updateUserAPI(userId, userData);
            return user;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to update user');
        }
    }
);

export const useHeart = createAsyncThunk(
    'user/useHeart',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const userId = state.user.userData?._id;

        // If no user (guest mode), just decrement locally
        if (!userId) {
            return state.user.hearts - 1;
        }

        try {
            const result = await useHeartAPI(userId);
            return result.hearts;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to use heart');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.userData = action.payload;
            state.hearts = action.payload?.hearts ?? 5;
            state.isPremium = action.payload?.isPremium ?? false;
            // Persist to localStorage
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },

        setHearts(state, action) {
            state.hearts = action.payload;
        },

        setPremium(state, action) {
            state.isPremium = action.payload;
            if (action.payload) state.hearts = 100; // Unlimited hearts for premium
        },

        decrementHearts(state) {
            if (state.hearts > 0 && !state.isPremium) {
                state.hearts -= 1;
            }
        },

        clearUser(state) {
            localStorage.removeItem('user');
            state.userData = null;
            state.hearts = 5;
            state.isPremium = false;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get user
            .addCase(getUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'idle';
                state.userData = action.payload;
                state.hearts = action.payload.hearts ?? 0;
                state.isPremium = action.payload.isPremium ?? false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })

            // Update user
            .addCase(updateUser.fulfilled, (state, action) => {
                state.userData = action.payload;
            })

            // Use heart
            .addCase(useHeart.fulfilled, (state, action) => {
                state.hearts = action.payload;
            })
            // Submit gameplay
            .addCase(submitCurrentGameplay.fulfilled, (state, action) => {
                const user = action.payload.updatedUser;
                if (user) {
                    state.userData = user;
                    state.hearts = user.hearts ?? state.hearts;
                }
            });
    },
});

export const { setUser, setHearts, setPremium, decrementHearts, clearUser } = userSlice.actions;
export default userSlice.reducer;
