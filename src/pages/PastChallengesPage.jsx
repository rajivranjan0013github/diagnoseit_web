import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ChevronLeft,
    Calendar,
    Lock,
    CheckCircle2,
    Info,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { fetchPastChallenges, fetchChallengeByDate } from '@/lib/api';
import { setCaseData, setSelectedTests, setSelectedDiagnosis, setSelectedTreatments, clearGame } from '@/store/slices/gameSlice';
import { cleanText } from '@/lib/utils';
import Image from '@/components/Image';

export default function PastChallengesPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isPremium, userData } = useSelector((state) => state.user);
    const userId = userData?._id || userData?.id;

    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [lastDate, setLastDate] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [loadingChallenge, setLoadingChallenge] = useState(null);

    const [showPremiumDialog, setShowPremiumDialog] = useState(false);

    const fetchChallenges = useCallback(async (isInitial = true) => {
        if (!userId) return;

        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        setError(null);
        try {
            const data = await fetchPastChallenges({
                limit: 10,
                sort: '-date',
                lastDate: isInitial ? null : lastDate,
                userId
            });

            if (isInitial) {
                setChallenges(data.challenges || []);
            } else {
                setChallenges(prev => [...prev, ...(data.challenges || [])]);
            }

            setLastDate(data.pagination?.lastDate || null);
            setHasMore(data.pagination?.hasMore || false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userId, lastDate]);

    useEffect(() => {
        fetchChallenges(true);
    }, [userId]);

    const handleSelectChallenge = async (challenge) => {
        if (!userId) return;

        // PRE-CHECK: If not premium and it's a past challenge, show dialog immediately
        const todayStr = new Date().toISOString().split('T')[0];
        if (!isPremium && challenge.date < todayStr) {
            setShowPremiumDialog(true);
            return;
        }

        setLoadingChallenge(challenge.date);

        try {
            const data = await fetchChallengeByDate(challenge.date, userId);

            if (data.alreadyCompleted && data.challenge && data.gameplay) {
                // Pre-populate game state for Clinical Insight
                const caseData = data.challenge.caseData || {};
                const completedGameplay = data.gameplay;

                // Map indices -> IDs for selections
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
                    dailyChallengeId: data.challenge._id,
                    caseData: caseData,
                    sourceType: 'dailyChallenge'
                }));
                dispatch(setSelectedTests(selectedTestIds));
                dispatch(setSelectedDiagnosis(selectedDiagnosisId));
                dispatch(setSelectedTreatments(selectedTreatmentIds));

                navigate(`/play/clinical-insight/${completedGameplay._id}`);
                return;
            }

            if (data.premiumRequired) {
                setShowPremiumDialog(true);
                return;
            }

            // Normal flow: Start the challenge
            dispatch(clearGame());
            dispatch(setCaseData({
                dailyChallengeId: data.challenge._id,
                caseData: data.challenge.caseData,
                sourceType: 'dailyChallenge',
                isBackdatePlay: data.isBackdate && data.isPremiumAccess,
            }));

            navigate(`/play/case/${data.challenge._id}`);
        } catch (err) {
            alert('Failed to load challenge: ' + err.message);
        } finally {
            setLoadingChallenge(null);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const pastChallenges = useMemo(() => challenges.filter(c => c.date < today), [challenges, today]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-2xl mx-auto pb-24 px-4 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/play')}
                    className="p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-sm border border-gray-100"
                >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Past Challenges</h1>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-2xl p-4 mb-6 flex items-start gap-4">
                <div className="bg-pink-100 p-2 rounded-xl">
                    <Calendar className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-0.5">Practice Archive</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Replay past challenges to sharpen your skills. Note: Points earned in practice mode 
                        do not affect your global ranking.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse flex items-center gap-4">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-1" />
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                            </div>
                            <div className="w-24 h-16 bg-gray-200 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <AlertCircle className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => fetchChallenges(true)}
                        className="px-6 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition"
                    >
                        Retry
                    </button>
                </div>
            ) : pastChallenges.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No past challenges available yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pastChallenges.map((item) => (
                        <button
                            key={item.date}
                            onClick={() => handleSelectChallenge(item)}
                            disabled={loadingChallenge !== null}
                            className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md hover:border-pink-200 flex items-center gap-4 group ${loadingChallenge === item.date ? 'opacity-60' : ''}`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-gray-400">{formatDate(item.date)}</span>
                                    {loadingChallenge === item.date && <Loader2 className="h-3 w-3 text-pink-500 animate-spin" />}
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition truncate">
                                    {item.metadata?.title || 'Daily Challenge'}
                                </h3>
                                <p className="text-sm text-gray-500">{item.metadata?.category || 'General Pathology'}</p>
                            </div>

                            {/* Thumbnail */}
                            <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {item.metadata?.mainimage ? (
                                    <>
                                        <Image
                                            src={item.metadata.mainimage}
                                            alt="Challenge"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        {/* Status Overlays */}
                                        {item.isCompleted ? (
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                                <CheckCircle2 className="h-5 w-5 text-white mb-0.5" />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Solved</span>
                                            </div>
                                        ) : !isPremium && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Lock className="h-5 w-5 text-white shadow-sm" />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <Calendar className="h-6 w-6 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                        <button
                            onClick={() => fetchChallenges(false)}
                            disabled={loadingMore}
                            className="w-full py-4 mt-4 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:border-pink-200 hover:text-pink-500 transition-all disabled:opacity-50"
                        >
                            {loadingMore ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                'Load More Challenges'
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Premium Dialog */}
            {showPremiumDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                        onClick={() => setShowPremiumDialog(false)}
                    />
                    <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Premium Header Decoration */}
                        <div className="bg-gradient-to-br from-pink-500 to-rose-600 h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                                    <circle cx="10" cy="10" r="20" />
                                    <circle cx="90" cy="30" r="15" />
                                    <circle cx="50" cy="80" r="25" />
                                </svg>
                            </div>
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                                <Lock className="h-10 w-10 text-white" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-black text-gray-800 mb-2">Practice Mode Locked</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Accessing the Daily Challenge archive requires a <span className="font-bold text-pink-500">Pro</span> membership. Upgrade now to replay all past cases!
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/play/premium')}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Get Pro Access
                                </button>
                                <button
                                    onClick={() => setShowPremiumDialog(false)}
                                    className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}
