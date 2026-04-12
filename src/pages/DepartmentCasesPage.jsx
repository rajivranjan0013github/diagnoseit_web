import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Lock, CheckCircle2, Stethoscope, Loader2, AlertCircle, FolderOpen, Heart } from 'lucide-react';
import { fetchCategoryCases, clearDepartmentCases } from '@/store/slices/progressSlice';
import { setCaseData, clearGame, loadCaseById, setSelectedTests, setSelectedDiagnosis, setSelectedTreatments, setScoreResult } from '@/store/slices/gameSlice';
import { fetchGameplays } from '@/lib/api';
import { cleanText } from '@/lib/utils';
import Image from '@/components/Image';

export default function DepartmentCasesPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData, isPremium, hearts } = useSelector((state) => state.user);
    const { departmentCases, departmentCasesStatus, error } = useSelector((state) => state.progress);

    const [showHeartsDialog, setShowHeartsDialog] = useState(false);
    const [showPremiumDialog, setShowPremiumDialog] = useState(false);
    const [loadingCaseId, setLoadingCaseId] = useState(null);

    useEffect(() => {
        if (userData?._id && categoryId) {
            dispatch(fetchCategoryCases({ userId: userData._id, categoryId }));
        }
        return () => {
            dispatch(clearDepartmentCases());
        };
    }, [dispatch, userData?._id, categoryId]);

    const handleStartCase = async (caseItem, index) => {
        if (loadingCaseId) return;

        const caseId = caseItem.caseId;
        const isLocked = !isPremium && index >= 2 && caseItem.status !== 'completed';

        if (isLocked) {
            setShowPremiumDialog(true);
            return;
        }

        if (!isPremium && hearts <= 0) {
            setShowHeartsDialog(true);
            return;
        }

        try {
            setLoadingCaseId(caseId);
            dispatch(clearGame()); // Reset entire game state

            if (caseItem.status === 'completed') {
                // LOAD CASE DATA FIRST (to get steps for mapping indices)
                const result = await dispatch(loadCaseById(caseId)).unwrap();
                const fullCaseData = result.caseData;

                // FETCH COMPLETED GAMEPLAY
                const gameplays = await fetchGameplays({
                    userId: userData._id,
                    caseId: caseId,
                    sourceType: 'case'
                });

                const gameplay = gameplays.find(gp => gp.status === 'completed');

                if (gameplay) {
                    // Map indices back to IDs (matching mobile logic)
                    const tests = fullCaseData?.steps?.[1]?.data?.availableTests || [];
                    const diags = fullCaseData?.steps?.[2]?.data?.diagnosisOptions || [];
                    const step4 = fullCaseData?.steps?.[3]?.data || {};
                    const flatTreatments = [
                        ...(step4.treatmentOptions?.medications || []),
                        ...(step4.treatmentOptions?.surgicalInterventional || []),
                        ...(step4.treatmentOptions?.nonSurgical || []),
                        ...(step4.treatmentOptions?.psychiatric || []),
                    ];

                    const selectedTestIds = (gameplay?.selections?.testIndices || [])
                        .map(i => (typeof i === 'number' && tests[i] ? tests[i].testId : null))
                        .filter(Boolean);

                    const selectedDiagnosisId = (typeof gameplay?.selections?.diagnosisIndex === 'number' && diags[gameplay.selections.diagnosisIndex])
                        ? diags[gameplay.selections.diagnosisIndex].diagnosisId
                        : null;

                    const selectedTreatmentIds = (gameplay?.selections?.treatmentIndices || [])
                        .map(i => (typeof i === 'number' && flatTreatments[i] ? flatTreatments[i].treatmentId : null))
                        .filter(Boolean);

                    // Update Redux with history
                    dispatch(setSelectedTests(selectedTestIds));
                    dispatch(setSelectedDiagnosis(selectedDiagnosisId));
                    dispatch(setSelectedTreatments(selectedTreatmentIds));
                    dispatch(setScoreResult(gameplay.points));

                    // GO TO CLINICAL INSIGHT
                    navigate(`/play/clinical-insight/${gameplay._id || gameplay.gameplayId}`);
                    return;
                }
            }

            // If not completed or history fetch failed/none found, start as new game
            dispatch(setCaseData({
                caseId,
                caseData: null,
                sourceType: 'case',
            }));

            navigate(`/play/case/${caseId}`);
        } catch (err) {
            console.error('Error starting case:', err);
        } finally {
            setLoadingCaseId(null);
        }
    };

    if (departmentCasesStatus === 'loading') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-pink-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading department cases...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-16 w-16 text-pink-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                <p className="text-gray-500 mb-6 max-w-xs">{error}</p>
                <button
                    onClick={() => dispatch(fetchCategoryCases({ userId: userData._id, categoryId }))}
                    className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    const cases = departmentCases?.cases || [];
    const categoryName = departmentCases?.name || 'Department';

    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/play')}
                    className="p-2 rounded-full hover:bg-white transition shadow-sm"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 capitalize">
                    {categoryName}
                </h1>
            </div>

            {cases.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-pink-50">
                    <FolderOpen className="h-16 w-16 text-pink-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No cases found in this department yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cases.map((item, index) => (
                        <React.Fragment key={item.caseId}>
                            {/* Premium Divider */}
                            {index === 2 && !isPremium && (
                                <div className="flex items-center gap-4 py-4">
                                    <div className="flex-1 h-px bg-pink-100" />
                                    <span className="text-xs font-black text-pink-400 uppercase tracking-widest">Premium Cases</span>
                                    <div className="flex-1 h-px bg-pink-100" />
                                </div>
                            )}

                            <button
                                onClick={() => handleStartCase(item, index)}
                                className={`w-full group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.01] flex items-center justify-between text-left ${!isPremium && index >= 2 && item.status !== 'completed' ? 'opacity-90' : ''
                                    }`}
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${item.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.status === 'completed' ? 'Solved' : 'Unsolved'}
                                        </span>
                                        {loadingCaseId === item.caseId && <Loader2 className="h-3 w-3 animate-spin text-pink-500" />}
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1 truncate">{item.caseTitle || 'Medical Case'}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{item.chiefComplaint}</p>
                                </div>

                                <div className="relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-gray-50">
                                    {item.mainimage ? (
                                        <Image
                                            src={item.mainimage}
                                            alt={item.caseTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Stethoscope className="h-8 w-8 text-gray-200" />
                                        </div>
                                    )}

                                    {/* Solved Overlay */}
                                    {item.status === 'completed' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Solved</span>
                                        </div>
                                    )}

                                    {/* Lock Overlay */}
                                    {!isPremium && index >= 2 && item.status !== 'completed' && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Lock className="h-5 w-5 text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Premium Dialog */}
            {showPremiumDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPremiumDialog(false)} />
                    <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-br from-pink-500 to-rose-600 h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                                    <path d="M50 20L60 40L80 40L65 55L70 75L50 65L30 75L35 55L20 40L40 40Z" />
                                </svg>
                            </div>
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                                <Lock className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-black text-gray-800 mb-2">Premium Case</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                                This specialized medical case is reserved for our <span className="font-bold text-pink-500">Pro</span> members. Upgrade now to master advanced diagnostics!
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/play/premium')}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Unlock All Cases
                                </button>
                                <button onClick={() => setShowPremiumDialog(false)} className="w-full py-2 text-gray-400 font-bold hover:text-gray-600 transition">
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hearts Dialog */}
            {showHeartsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHeartsDialog(false)} />
                    <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 h-32 flex items-center justify-center relative">
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                                <Heart className="h-10 w-10 text-white fill-white animate-pulse" />
                            </div>
                        </div>
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-black text-gray-800 mb-2">Out of Hearts!</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed text-sm font-medium text-pretty">
                                You need at least one heart to start a clinical case. Upgrade to <span className="font-bold text-pink-500">Pro</span> for unlimited play!
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/play/premium')}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Get Unlimited Hearts
                                </button>
                                <button onClick={() => setShowHeartsDialog(false)} className="w-full py-2 text-gray-400 font-bold hover:text-gray-600 transition">
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
