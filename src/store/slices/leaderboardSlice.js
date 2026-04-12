import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOverallLeaderboard, fetchTodayDailyLeaderboard, fetchUserPosition } from '@/lib/api';

const initialState = {
    overallItems: [],
    overallStatus: 'idle',
    overallError: null,

    dailyItems: [],
    dailyStatus: 'idle',
    dailyError: null,

    myOverallRank: null,
    myDailyRank: null,
    myPositionStatus: 'idle',

    lastFetched: null,
};

// Async thunks
export const fetchOverallTop10 = createAsyncThunk(
    'leaderboard/fetchOverallTop10',
    async (userId, { rejectWithValue }) => {
        try {
            return await fetchOverallLeaderboard(userId);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchTodayLeaderboard = createAsyncThunk(
    'leaderboard/fetchTodayLeaderboard',
    async (userId, { rejectWithValue }) => {
        try {
            return await fetchTodayDailyLeaderboard(userId);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchMyOverallPosition = createAsyncThunk(
    'leaderboard/fetchMyOverallPosition',
    async (userId, { rejectWithValue }) => {
        try {
            return await fetchUserPosition(userId);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        clearLeaderboard(state) {
            state.overallItems = [];
            state.dailyItems = [];
            state.myOverallRank = null;
            state.myDailyRank = null;
            state.lastFetched = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Overall
            .addCase(fetchOverallTop10.pending, (state) => {
                state.overallStatus = 'loading';
            })
            .addCase(fetchOverallTop10.fulfilled, (state, action) => {
                state.overallStatus = 'succeeded';
                state.overallItems = action.payload.top10;
                if (action.payload.me) {
                    state.myOverallRank = {
                        rank: action.payload.me.rank,
                        points: action.payload.me.score
                    };
                }
                state.lastFetched = Date.now();
            })
            .addCase(fetchOverallTop10.rejected, (state, action) => {
                state.overallStatus = 'failed';
                state.overallError = action.payload;
            })
            // Daily
            .addCase(fetchTodayLeaderboard.pending, (state) => {
                state.dailyStatus = 'loading';
            })
            .addCase(fetchTodayLeaderboard.fulfilled, (state, action) => {
                state.dailyStatus = 'succeeded';
                state.dailyItems = action.payload.top10;
                if (action.payload.me) {
                    state.myDailyRank = {
                        rank: action.payload.me.rank,
                        score: action.payload.me.score
                    };
                }
            })
            .addCase(fetchTodayLeaderboard.rejected, (state, action) => {
                state.dailyStatus = 'failed';
                state.dailyError = action.payload;
            })
            // My Position
            .addCase(fetchMyOverallPosition.pending, (state) => {
                state.myPositionStatus = 'loading';
            })
            .addCase(fetchMyOverallPosition.fulfilled, (state, action) => {
                state.myPositionStatus = 'succeeded';
                state.myOverallRank = action.payload;
            })
            .addCase(fetchMyOverallPosition.rejected, (state) => {
                state.myPositionStatus = 'failed';
            });
    },
});

export const { clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
