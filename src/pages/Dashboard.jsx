import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Stethoscope, Heart, ChevronRight, Loader2, Clock, Trophy, Sparkles, History } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCaseData, clearGame, setSelectedTests, setSelectedDiagnosis, setSelectedTreatments } from '@/store/slices/gameSlice';
import { loadTodaysChallenge, selectCurrentChallenge, selectIsChallengeLoading, selectHasChallengeError, selectChallengeError } from '@/store/slices/dailyChallengeSlice';
import { fetchDepartmentProgress } from '@/store/slices/progressSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { cleanText } from '@/lib/utils';
import Image from '@/components/Image';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// 1 hour expiration for suggested case
const SUGGESTED_CASE_EXPIRY_MS = 60 * 60 * 1000;

// Skeleton components
function DailyChallengeSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-10 bg-gray-200 rounded-full w-full" />
        </div>
    );
}

function DepartmentSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between mb-2">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded w-12" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-2.5 bg-gray-200 rounded-full w-full" />
                </div>
            ))}
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { userData, hearts, isPremium } = useAppSelector((state) => state.user);
    const userId = userData?._id || userData?.id;

    // Daily challenge selectors
    const currentChallenge = useAppSelector(selectCurrentChallenge);
    const isChallengeLoading = useAppSelector(selectIsChallengeLoading);
    const hasChallengeError = useAppSelector(selectHasChallengeError);
    const challengeError = useAppSelector(selectChallengeError);

    // Progress and Categories selectors
    const { status: progressStatus, items: departmentProgress } = useAppSelector(state => state.progress);
    const { status: categoriesLoading } = useAppSelector(state => state.categories);

    // Local state for completion and suggestions
    const [isDailyChallengeCompleted, setIsDailyChallengeCompleted] = useState(false);
    const [isCheckingCompletion, setIsCheckingCompletion] = useState(true);
    const [isDailyChallengeLoading, setIsDailyChallengeLoading] = useState(false);
    const [suggestedNextCase, setSuggestedNextCase] = useState(() => {
        try {
            const persistedCase = localStorage.getItem('suggestedNextCase');
            if (persistedCase) {
                const parsed = JSON.parse(persistedCase);
                const savedAt = parsed.savedAt || 0;
                const now = Date.now();
                if (now - savedAt > SUGGESTED_CASE_EXPIRY_MS) {
                    localStorage.removeItem('suggestedNextCase');
                    return null;
                }
                return parsed;
            }
        } catch (e) {
            console.error('Error loading persisted suggested case:', e);
        }
        return null;
    });

    // Load initial data
    useEffect(() => {
        dispatch(loadTodaysChallenge());
        dispatch(fetchCategories());
        if (userId) {
            dispatch(fetchDepartmentProgress(userId));
        }
    }, [dispatch, userId]);

    // Check completion status for daily challenge
    useEffect(() => {
        const checkDailyChallengeCompletion = async () => {
            if (!currentChallenge?._id || !userId) {
                if (!isChallengeLoading) setIsCheckingCompletion(false);
                return;
            }

            setIsCheckingCompletion(true);
            try {
                const res = await fetch(
                    `${API_BASE}/api/gameplays?userId=${encodeURIComponent(userId)}&dailyChallengeId=${encodeURIComponent(currentChallenge._id)}&sourceType=dailyChallenge`
                );
                if (!res.ok) throw new Error('Failed to check completion');
                const data = await res.json();
                const gameplays = data?.gameplays || [];
                const completedGameplay = gameplays.find(gp => gp.status === 'completed');
                setIsDailyChallengeCompleted(!!completedGameplay);
            } catch (error) {
                console.error('Error checking daily challenge completion:', error);
            } finally {
                setIsCheckingCompletion(false);
            }
        };

        checkDailyChallengeCompletion();
    }, [currentChallenge, userId, isChallengeLoading]);

    // Suggested case logic
    const noDailyChallengeAvailable = (!isChallengeLoading && !currentChallenge) || hasChallengeError;
    const shouldShowSuggestedCase = isDailyChallengeCompleted || noDailyChallengeAvailable;

    useEffect(() => {
        if (suggestedNextCase) return;

        if (shouldShowSuggestedCase && progressStatus === 'succeeded' && Array.isArray(departmentProgress)) {
            const deptsWithCases = departmentProgress.filter(
                dept => Array.isArray(dept.unsolvedCases) && dept.unsolvedCases.length > 0
            );

            if (deptsWithCases.length > 0) {
                const randomDept = deptsWithCases[Math.floor(Math.random() * deptsWithCases.length)];
                const nextCase = randomDept.unsolvedCases[0];

                if (nextCase) {
                    const newSuggestedCase = {
                        caseId: nextCase.caseId,
                        caseTitle: nextCase.caseTitle || 'Medical Case',
                        mainimage: nextCase.mainimage || null,
                        departmentName: randomDept.name || 'Department',
                        savedAt: Date.now(),
                    };
                    setSuggestedNextCase(newSuggestedCase);
                    localStorage.setItem('suggestedNextCase', JSON.stringify(newSuggestedCase));
                }
            }
        }
    }, [shouldShowSuggestedCase, progressStatus, departmentProgress, suggestedNextCase]);

    const [showHeartsDialog, setShowHeartsDialog] = useState(false);

    // Handle daily challenge click
    const handleDailyChallengeClick = useCallback(async () => {
        if (!currentChallenge?._id || !userId) {
            // Fallback for non-logged in or no challenge
            if (currentChallenge) {
                dispatch(setCaseData({
                    dailyChallengeId: currentChallenge._id,
                    caseData: currentChallenge.caseData,
                    sourceType: 'dailyChallenge'
                }));
                navigate('/play/case/' + currentChallenge._id);
            }
            return;
        }

        // HEART CHECK: If not premium and 0 hearts, show dialog
        if (!isPremium && hearts === 0) {
            // First check if they've already completed it (viewing insight is free)
            if (!isDailyChallengeCompleted) {
                setShowHeartsDialog(true);
                return;
            }
        }

        setIsDailyChallengeLoading(true);
        try {
            const res = await fetch(
                `${API_BASE}/api/gameplays?userId=${encodeURIComponent(userId)}&dailyChallengeId=${encodeURIComponent(currentChallenge._id)}&sourceType=dailyChallenge`
            );
            if (!res.ok) throw new Error('Failed to check gameplay status');
            const data = await res.json();
            const gameplays = data?.gameplays || [];
            const completedGameplay = gameplays.find(gp => gp.status === 'completed');

            if (completedGameplay) {
                const caseData = currentChallenge.caseData || {};

                // Map indices -> IDs for selections (mirroring gtdfront)
                const tests = caseData.steps?.[1]?.data?.availableTests || [];
                const diags = caseData.steps?.[2]?.data?.diagnosisOptions || [];
                const step4 = caseData.steps?.[3]?.data || {};
                const flatTreatments = [
                    ...(step4.treatmentOptions?.medications || []),
                    ...(step4.treatmentOptions?.surgicalInterventional || []),
                    ...(step4.treatmentOptions?.nonSurgical || []),
                    ...(step4.treatmentOptions?.psychiatric || []),
                ];

                const selectedTestIds = (completedGameplay.selections?.testIndices || [])
                    .map(i => tests[i]?.testId).filter(Boolean);
                const selectedDiagnosisId = diags[completedGameplay.selections?.diagnosisIndex]?.diagnosisId || null;
                const selectedTreatmentIds = (completedGameplay.selections?.treatmentIndices || [])
                    .map(i => flatTreatments[i]?.treatmentId).filter(Boolean);

                dispatch(setCaseData({
                    dailyChallengeId: currentChallenge._id,
                    caseData: caseData,
                    sourceType: 'dailyChallenge'
                }));
                dispatch(setSelectedTests(selectedTestIds));
                dispatch(setSelectedDiagnosis(selectedDiagnosisId));
                dispatch(setSelectedTreatments(selectedTreatmentIds));

                navigate(`/play/clinical-insight/${completedGameplay._id}`);
            } else {
                dispatch(clearGame());
                dispatch(setCaseData({
                    dailyChallengeId: currentChallenge._id,
                    caseData: currentChallenge.caseData,
                    sourceType: 'dailyChallenge',
                }));
                navigate(`/play/case/${currentChallenge._id}`);
            }
        } catch (error) {
            console.error('Error in handleDailyChallengeClick:', error);
            // Fallback to normal flow
            dispatch(clearGame());
            dispatch(setCaseData({
                dailyChallengeId: currentChallenge._id,
                caseData: currentChallenge.caseData,
                sourceType: 'dailyChallenge',
            }));
            navigate(`/play/case/${currentChallenge._id}`);
        } finally {
            setIsDailyChallengeLoading(false);
        }
    }, [currentChallenge, userId, dispatch, navigate, isPremium, hearts]);

    // Handle case click
    const handleCaseClick = useCallback(async (caseId) => {
        if (!isPremium && hearts === 0) {
            setShowHeartsDialog(true);
            return;
        }
        dispatch(clearGame());
        navigate(`/play/case/${caseId}`);
    }, [dispatch, navigate, isPremium, hearts]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4">
            {/* Daily Challenge Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-pink-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">Daily Challenge</h2>
                        </div>
                        {isDailyChallengeCompleted && (
                            <span className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-bold">
                                Already Played ✓
                            </span>
                        )}
                    </div>

                    {(isChallengeLoading || isCheckingCompletion) && <DailyChallengeSkeleton />}

                    {hasChallengeError && !isChallengeLoading && (
                        <p className="text-red-600 text-sm mb-4">{challengeError || 'Failed to load today\'s challenge'}</p>
                    )}

                    {currentChallenge && !isChallengeLoading && !isCheckingCompletion && (
                        <>
                            {isDailyChallengeCompleted ? (
                                <div className="flex flex-col items-center justify-center py-4 px-4">
                                    <h3 className="text-xl font-black text-gray-900 mb-1">Today challenge is completed</h3>
                                    <p className="text-xs text-gray-400 text-center mb-4 max-w-xs font-medium">
                                        Excellent diagnostic skills! You've already mastered today's medical case.
                                    </p>
                                    <button
                                        onClick={handleDailyChallengeClick}
                                        className="inline-flex items-center justify-center gap-3 rounded-full bg-white border-2 border-pink-500 px-10 py-3.5 font-black text-pink-600 shadow-md transition hover:bg-pink-50 hover:shadow-lg active:scale-95 group"
                                    >
                                        <Sparkles className="h-5 w-5 fill-pink-500" />
                                        View Insight
                                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {currentChallenge.caseData?.mainimage && (
                                        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 bg-gray-100 group cursor-pointer" onClick={handleDailyChallengeClick}>
                                            <Image
                                                src={currentChallenge.caseData.mainimage}
                                                alt="Daily Challenge"
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                                <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-xl" style={{ fontFamily: '"Inter", sans-serif' }}>
                                                    {cleanText(currentChallenge.caseData?.caseTitle || "Solve today's case to keep your streak alive!")}
                                                </h3>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDailyChallengeClick}
                                        disabled={isDailyChallengeLoading}
                                        className="w-full flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4 font-black text-white shadow-xl transition hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                                    >
                                        {isDailyChallengeLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Preparing Case...
                                            </>
                                        ) : (
                                            <>
                                                Solve Today's Challenge
                                                <ChevronRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    {!currentChallenge && !isChallengeLoading && !isCheckingCompletion && !hasChallengeError && (
                        <p className="text-gray-500 mb-4">No daily challenge available for today. Check back tomorrow!</p>
                    )}
                </div>
            </div>

            {/* Suggested Case Card */}
            {shouldShowSuggestedCase && suggestedNextCase && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-6 w-6 text-pink-600" />
                            <h2 className="text-lg font-bold text-gray-800">Solve the Case</h2>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-pink-600 text-white text-xs font-bold capitalize">
                            {suggestedNextCase.departmentName}
                        </span>
                    </div>

                    {suggestedNextCase.mainimage && (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 bg-gray-100">
                            <Image
                                src={suggestedNextCase.mainimage}
                                alt="Suggested Case"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-16">
                                <h3 className="text-xl md:text-xl font-bold text-white leading-tight drop-shadow-lg" style={{ fontFamily: '"Playfair Display", "Georgia", "serif"' }}>
                                    {cleanText(suggestedNextCase.caseTitle)}
                                </h3>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => handleCaseClick(suggestedNextCase.caseId)}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
                    >
                        Start Case
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}



            {/* Departments */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-pink-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Departments</h2>
                </div>

                {progressStatus === 'loading' && <DepartmentSkeleton />}

                {progressStatus === 'succeeded' && departmentProgress.filter(dept => dept.totalCount > 0).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No departments available with cases</p>
                )}

                {progressStatus === 'succeeded' && departmentProgress.filter(dept => dept.totalCount > 0).map((dept) => {
                    const firstCase = dept.unsolvedCases?.[0];
                    const progress = dept.totalCount > 0 ? (dept.completedCount / dept.totalCount) * 100 : 0;
                    return (
                        <button
                            key={dept.categoryId}
                            onClick={() => navigate(`/play/department/${dept.categoryId}`)}
                            className="w-full text-left bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-4 hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-gray-800 uppercase tracking-wide">{dept.name}</h3>
                                <span className="text-sm font-bold text-gray-600">{dept.completedCount}/{dept.totalCount}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{firstCase?.caseTitle || 'No pending cases'}</p>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-pink-300 to-pink-600" style={{ width: `${progress}%` }} />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Hearts Dialog */}
            {showHeartsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                        onClick={() => setShowHeartsDialog(false)}
                    />
                    <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header Decoration */}
                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                                    <path d="M50 85c-20-15-40-30-40-45 0-10 8-18 18-18 5 0 10 3 13 8l9 12 9-12c3-5 8-8 13-8 10 0 18 8 18 18 0 15-20 30-40 45z" />
                                </svg>
                            </div>
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md translate-y-2">
                                <Heart className="h-10 w-10 text-white fill-white animate-pulse" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center text-pretty">
                            <h2 className="text-2xl font-black text-gray-800 mb-2">Out of Hearts!</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                                You need at least one heart to start a clinical case. Upgrade to <span className="font-bold text-pink-500">Pro</span> for unlimited medical puzzles!
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/play/premium')}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Get Unlimited Hearts
                                </button>
                                <button
                                    onClick={() => setShowHeartsDialog(false)}
                                    className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition"
                                >
                                    Refill Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
