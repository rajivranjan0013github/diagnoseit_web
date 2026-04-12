import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import userReducer from './slices/userSlice';
import historyReducer from './slices/historySlice';
import leaderboardReducer from './slices/leaderboardSlice';
import progressReducer from './slices/progressSlice';
import categoriesReducer from './slices/categoriesSlice';
import dailyChallengeReducer from './slices/dailyChallengeSlice';
import dailyChallengeLeaderboardReducer from './slices/dailyChallengeLeaderboardSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        user: userReducer,
        history: historyReducer,
        leaderboard: leaderboardReducer,
        progress: progressReducer,
        categories: categoriesReducer,
        dailyChallenge: dailyChallengeReducer,
        dailyChallengeLeaderboard: dailyChallengeLeaderboardReducer,
    },
});
