import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { computeGameplayScoreNormalized } from '@/lib/scoring';
import { fetchCase, submitGameplay } from '@/lib/api';

// Thunk: load case data by ObjectId and store as current case
export const loadCaseById = createAsyncThunk(
    'game/loadCaseById',
    async (caseId) => {
        try {
            const caseDoc = await fetchCase(caseId);
            return {
                caseId: caseDoc?._id,
                caseData: caseDoc?.caseData,
                voiceId: caseDoc?.voiceId,
                sourceType: 'case'
            };
        } catch (err) {
            throw new Error(err.message || `Failed to load case ${caseId}`);
        }
    }
);

const initialState = {
    // Source type: 'case' or 'dailyChallenge'
    sourceType: 'case',
    caseId: null,
    dailyChallengeId: null,
    caseData: null,
    voiceId: null,
    audioPaused: false,
    isBackdatePlay: false, // For premium users playing past challenges
    selectedTestIds: [],
    selectedDiagnosisId: null,
    selectedTreatmentIds: [],
    status: 'idle', // 'idle', 'loading', 'in_progress', 'completed'
    error: null,
    gameplayId: null, // Last submitted gameplay ID
    lastSubmittedGameplayId: null,
    scoreResult: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // setCaseData supports both case and dailyChallenge
        setCaseData(state, action) {
            const { caseId, dailyChallengeId, caseData, sourceType, voiceId, isBackdatePlay } = action.payload || {};

            const effectiveSourceType = sourceType || (dailyChallengeId ? 'dailyChallenge' : 'case');
            state.sourceType = effectiveSourceType;

            if (effectiveSourceType === 'dailyChallenge') {
                state.dailyChallengeId = dailyChallengeId || null;
                state.caseId = null;
                state.voiceId = null;
                state.isBackdatePlay = isBackdatePlay === true;
            } else {
                state.caseId = caseId || null;
                state.dailyChallengeId = null;
                state.voiceId = voiceId || null;
                state.isBackdatePlay = false;
            }

            state.caseData = caseData || null;
            state.status = 'in_progress';
            state.audioPaused = false;

            // Clear previous selections
            state.selectedTestIds = [];
            state.selectedDiagnosisId = null;
            state.selectedTreatmentIds = [];
        },
        setSelectedTests(state, action) {
            state.selectedTestIds = Array.isArray(action.payload) ? action.payload : [];
        },
        setSelectedDiagnosis(state, action) {
            state.selectedDiagnosisId = action.payload || null;
        },
        setSelectedTreatments(state, action) {
            state.selectedTreatmentIds = Array.isArray(action.payload) ? action.payload : [];
        },
        toggleTreatment(state, action) {
            const id = action.payload;
            if (state.selectedTreatmentIds.includes(id)) {
                state.selectedTreatmentIds = state.selectedTreatmentIds.filter(tid => tid !== id);
            } else {
                state.selectedTreatmentIds.push(id);
            }
        },
        toggleTest(state, action) {
            const id = action.payload;
            if (state.selectedTestIds.includes(id)) {
                state.selectedTestIds = state.selectedTestIds.filter(tid => tid !== id);
            } else {
                state.selectedTestIds.push(id);
            }
        },
        setAudioPaused(state, action) {
            state.audioPaused = action.payload !== undefined ? action.payload : false;
        },
        toggleAudioPaused(state) {
            state.audioPaused = !state.audioPaused;
        },
        clearGame(state) {
            return {
                ...initialState,
            };
        },
        setGameStatus(state, action) {
            state.status = action.payload;
        },
        setScoreResult(state, action) {
            state.scoreResult = action.payload;
        },
        setGameplayId(state, action) {
            state.lastSubmittedGameplayId = action.payload;
            state.gameplayId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCaseById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadCaseById.fulfilled, (state, action) => {
                state.status = 'in_progress';
                state.sourceType = action.payload.sourceType || 'case';
                state.caseId = action.payload.caseId || null;
                state.dailyChallengeId = null;
                state.caseData = action.payload.caseData || null;
                state.voiceId = action.payload.voiceId || null;
                state.audioPaused = false;

                state.selectedTestIds = [];
                state.selectedDiagnosisId = null;
                state.selectedTreatmentIds = [];
            })
            .addCase(loadCaseById.rejected, (state, action) => {
                state.status = 'idle';
                state.error = action.error?.message || 'Failed to load case';
            })
            .addCase(submitCurrentGameplay.fulfilled, (state, action) => {
                state.lastSubmittedGameplayId = action.payload.gameplayId;
                state.gameplayId = action.payload.gameplayId;
                state.scoreResult = action.payload.score;
            });
    }
});

// Submit gameplay thunk
export const submitCurrentGameplay = createAsyncThunk(
    'game/submitGameplay',
    async (_, { getState }) => {
        const state = getState();
        const {
            sourceType,
            caseId,
            dailyChallengeId,
            caseData,
            isBackdatePlay,
            selectedTestIds,
            selectedDiagnosisId,
            selectedTreatmentIds
        } = state.game;

        const userId = state.user?.userData?._id || state.user?.userData?.id;

        if (!userId) throw new Error('Missing userId');
        if (sourceType === 'case' && !caseId) throw new Error('Missing caseId');
        if (sourceType === 'dailyChallenge' && !dailyChallengeId) throw new Error('Missing dailyChallengeId');
        if (!caseData) throw new Error('Missing case data');

        // Map tests to indices
        const tests = caseData?.steps?.[1]?.data?.availableTests || [];
        const testIndexMap = new Map(tests.map((t, i) => [t.testId, i]));
        const testIndices = (selectedTestIds || [])
            .map((id) => testIndexMap.get(id))
            .filter((i) => typeof i === 'number');

        // Map diagnosis to index
        const diags = caseData?.steps?.[2]?.data?.diagnosisOptions || [];
        const diagIndexMap = new Map(diags.map((d, i) => [d.diagnosisId, i]));
        const diagnosisIndex = selectedDiagnosisId != null ? diagIndexMap.get(selectedDiagnosisId) : null;

        // Map treatments to indices
        const step4 = caseData?.steps?.[3]?.data || {};
        const flatTreatments = [
            ...(step4.treatmentOptions?.medications || []),
            ...(step4.treatmentOptions?.surgicalInterventional || []),
            ...(step4.treatmentOptions?.nonSurgical || []),
            ...(step4.treatmentOptions?.psychiatric || []),
        ];
        const treatIndexMap = new Map(flatTreatments.map((t, i) => [t.treatmentId, i]));
        const treatmentIndices = (selectedTreatmentIds || [])
            .map((id) => treatIndexMap.get(id))
            .filter((i) => typeof i === 'number');

        const score = computeGameplayScoreNormalized(caseData, {
            selectedTestIds,
            selectedDiagnosisId,
            selectedTreatmentIds,
        });

        const requestBody = {
            userId,
            sourceType,
            diagnosisIndex,
            testIndices,
            treatmentIndices,
            points: score,
            complete: true,
        };

        if (sourceType === 'dailyChallenge') {
            requestBody.dailyChallengeId = dailyChallengeId;
            if (isBackdatePlay) requestBody.isBackdatePlay = true;
        } else {
            requestBody.caseId = caseId;
        }

        try {
            const data = await submitGameplay(requestBody);
            return {
                gameplayId: data?.gameplay?._id,
                updatedUser: data?.updatedUser || null,
                sourceType,
                score
            };
        } catch (err) {
            throw new Error(err.message || 'Failed to submit gameplay');
        }
    }
);

export const {
    setCaseData,
    setSelectedTests,
    setSelectedDiagnosis,
    setSelectedTreatments,
    setAudioPaused,
    toggleAudioPaused,
    clearGame,
    setGameStatus,
    setScoreResult,
    setGameplayId,
    toggleTreatment,
    toggleTest,
} = gameSlice.actions;

export default gameSlice.reducer;
