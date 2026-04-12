import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { submitCurrentGameplay } from './gameSlice';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

/**
 * Thunk: Fetch today's daily challenge leaderboard
 */
export const fetchTodayDailyLeaderboard = createAsyncThunk(
    'dailyChallengeLeaderboard/fetchToday',
    async ({ userId, timezone } = {}, { rejectWithValue }) => {
        try {
            const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
            let url = `${API_BASE}/api/daily-challenge/leaderboard/today?timezone=${encodeURIComponent(userTimezone)}`;
            if (userId) {
                url += `&userId=${encodeURIComponent(userId)}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok || data?.error) {
                const message = data?.error || 'Failed to load daily challenge leaderboard';
                return rejectWithValue(message);
            }

            return data;
        } catch (err) {
            return rejectWithValue(err?.message || 'Network error');
        }
    }
);

/**
 * Thunk: Fetch daily challenge leaderboard for a specific date
 */
export const fetchDailyLeaderboardByDate = createAsyncThunk(
    'dailyChallengeLeaderboard/fetchByDate',
    async ({ date, userId, timezone } = {}, { rejectWithValue }) => {
        try {
            if (!date) {
                return rejectWithValue('Date is required');
            }

            const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
            let url = `${API_BASE}/api/daily-challenge/leaderboard/${date}?timezone=${encodeURIComponent(userTimezone)}`;
            if (userId) {
                url += `&userId=${encodeURIComponent(userId)}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok || data?.error) {
                const message = data?.error || 'Failed to load daily challenge leaderboard';
                return rejectWithValue(message);
            }

            return data;
        } catch (err) {
            return rejectWithValue(err?.message || 'Network error');
        }
    }
);

const initialState = {
    items: [],
    me: null,
    date: null,
    challengeId: null,
    challengeTitle: '',
    category: '',
    totalParticipants: 0,
    status: 'idle',
    error: null,
};

const dailyChallengeLeaderboardSlice = createSlice({
    name: 'dailyChallengeLeaderboard',
    initialState,
    reducers: {
        clearDailyLeaderboard(state) {
            Object.assign(state, initialState);
        },
        setDailyLeaderboardIdle(state) {
            state.status = 'idle';
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodayDailyLeaderboard.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTodayDailyLeaderboard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload?.top10 || [];
                state.me = action.payload?.me || null;
                state.date = action.payload?.date || null;
                state.challengeId = action.payload?.challengeId || null;
                state.challengeTitle = action.payload?.challengeTitle || '';
                state.category = action.payload?.category || '';
                state.totalParticipants = action.payload?.totalParticipants || 0;
                state.error = null;
            })
            .addCase(fetchTodayDailyLeaderboard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to load leaderboard';
            })
            .addCase(fetchDailyLeaderboardByDate.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDailyLeaderboardByDate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload?.top10 || [];
                state.me = action.payload?.me || null;
                state.date = action.payload?.date || null;
                state.challengeId = action.payload?.challengeId || null;
                state.challengeTitle = action.payload?.challengeTitle || '';
                state.category = action.payload?.category || '';
                state.totalParticipants = action.payload?.totalParticipants || 0;
                state.error = null;
            })
            .addCase(fetchDailyLeaderboardByDate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to load leaderboard';
            })
            // Reset status to idle when a daily challenge is submitted (from gameSlice)
            .addCase(submitCurrentGameplay.fulfilled, (state, action) => {
                if (action.payload?.sourceType === 'dailyChallenge') {
                    state.status = 'idle';
                }
            });
    },
});

export const { clearDailyLeaderboard, clearError, setDailyLeaderboardIdle } = dailyChallengeLeaderboardSlice.actions;

export default dailyChallengeLeaderboardSlice.reducer;
