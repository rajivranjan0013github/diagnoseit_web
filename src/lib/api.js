// API client for Diagnose It backend
// Backend running at localhost:3002

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Helper for fetch with error handling
async function fetchAPI(endpoint, options) {
    const url = `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `API Error: ${response.status}`);
    }

    return response.json();
}

// ============ Cases ============

// GET /api/cases/:id - fetch a single case by ObjectId
export async function fetchCase(caseId) {
    const data = await fetchAPI(`/api/cases/${caseId}`);
    return data.case;
}

// ============ Categories ============

// GET /api/categories - list all categories
export async function fetchCategories() {
    const data = await fetchAPI('/api/categories');
    return data.categories;
}

// GET /api/categories/:categoryId/cases - get all cases for a category
export async function fetchCasesByCategory(categoryId) {
    const data = await fetchAPI(`/api/categories/${categoryId}/cases`);
    return data.cases;
}

// ============ Daily Challenge ============

// GET /api/daily-challenge/today - Get today's challenge
export async function fetchTodaysChallenge(userId) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let url = `/api/daily-challenge/today?timezone=${encodeURIComponent(timezone)}`;
    if (userId) url += `&userId=${encodeURIComponent(userId)}`;
    return fetchAPI(url);
}

// GET /api/daily-challenge/:date - Get challenge by specific date
export async function fetchChallengeByDate(date, userId) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let url = `/api/daily-challenge/${date}?timezone=${encodeURIComponent(timezone)}`;
    if (userId) url += `&userId=${encodeURIComponent(userId)}`;
    return fetchAPI(url);
}

// GET /api/daily-challenge - List past challenges with pagination
export async function fetchPastChallenges({ limit = 10, sort = '-date', lastDate = null, userId = null } = {}) {
    let url = `/api/daily-challenge?limit=${limit}&sort=${sort}`;
    if (lastDate) url += `&lastDate=${lastDate}`;
    if (userId) url += `&userId=${userId}`;
    return fetchAPI(url);
}

// GET /api/daily-challenge/leaderboard/today - Get today's daily challenge leaderboard
export async function fetchTodayDailyLeaderboard(userId) {
    let url = '/api/daily-challenge/leaderboard/today';
    if (userId) url += `?userId=${encodeURIComponent(userId)}`;
    const data = await fetchAPI(url);
    return {
        top10: data.top10 || [],
        me: data.me || null,
    };
}

// GET /api/daily-challenge/leaderboard/:date - Get leaderboard for a specific date
export async function fetchDailyLeaderboardByDate(date) {
    const data = await fetchAPI(`/api/daily-challenge/leaderboard/${date}`);
    return data.top10 || [];
}

// ============ User ============

// GET /api/users/:userID - Get user data
export async function fetchUser(userId) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return fetchAPI(`/api/users/${userId}?timezone=${encodeURIComponent(timezone)}`);
}

// POST /api/users/:userID - Update user data
export async function updateUser(userId, userData) {
    return fetchAPI(`/api/users/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ user: userData }),
    });
}

// POST /api/users/:userID/hearts/use - Use a heart
export async function useHeart(userId) {
    return fetchAPI(`/api/users/${userId}/hearts/use`, {
        method: 'POST',
    });
}

// GET /api/users/:userId/next-cases - Get next cases per department
export async function fetchNextCasesPerDepartment(userId) {
    return fetchAPI(`/api/users/${userId}/next-cases`);
}

// ============ Gameplay ============

// POST /api/gameplays/submit - Submit gameplay selections
export async function submitGameplay(submission) {
    return fetchAPI('/api/gameplays/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
    });
}

// GET /api/gameplays - List gameplays with filters
export async function fetchGameplays(params = {}) {
    const query = new URLSearchParams(params).toString();
    const data = await fetchAPI(`/api/gameplays?${query}`);
    return data.gameplays || [];
}

// ============ Overall Leaderboard ============

// GET /api/leaderboard/top10 - Get top 10 overall
export async function fetchOverallLeaderboard(userId) {
    let url = '/api/leaderboard/top10';
    if (userId) url += `?userId=${encodeURIComponent(userId)}`;
    const data = await fetchAPI(url);
    return {
        top10: data.top10 || [],
        me: data.me || null,
    };
}

// GET /api/leaderboard/position/:userId - Get user's position
export async function fetchUserPosition(userId) {
    return fetchAPI(`/api/leaderboard/position/${userId}`);
}

// ============ Referral ============

// POST /api/referral/apply - Apply a referral code
export async function applyReferralCode(userId, referralCode) {
    return fetchAPI('/api/referral/apply', {
        method: 'POST',
        body: JSON.stringify({ userId, referralCode }),
    });
}

// GET /api/login/web/google/loginSignUp - Login with Google Auth Code (Web)
export async function loginWithGoogle(code) {
    return fetchAPI(`/api/login/web/google/loginSignUp?code=${encodeURIComponent(code)}`);
}
