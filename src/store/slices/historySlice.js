import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
    lastFetched: null,
};

// Async thunk for fetching gameplay history
export const fetchGameplayHistory = createAsyncThunk(
    'history/fetchGameplayHistory',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';
            const res = await fetch(
                `${API_BASE}/api/gameplays/brief?userId=${encodeURIComponent(userId)}`
            );
            if (!res.ok) {
                throw new Error('Failed to load past cases');
            }
            const data = await res.json();
            return Array.isArray(data?.items) ? data.items : [];
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to load');
        }
    },
    {
        // Only fetch if we don't have data or it's been more than 5 minutes
        condition: (_, { getState }) => {
            const state = getState();
            const { status, lastFetched } = state.history;

            // Don't fetch if already loading
            if (status === 'loading') {
                return false;
            }

            // Fetch if never fetched or data is stale (older than 5 minutes)
            if (!lastFetched) {
                return true;
            }

            const fiveMinutes = 5 * 60 * 1000;
            const isStale = Date.now() - lastFetched > fiveMinutes;
            return isStale;
        },
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        clearHistory(state) {
            return initialState;
        },
        // Force refresh next time
        invalidateHistory(state) {
            state.lastFetched = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGameplayHistory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchGameplayHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.lastFetched = Date.now();
            })
            .addCase(fetchGameplayHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearHistory, invalidateHistory } = historySlice.actions;
export default historySlice.reducer;
