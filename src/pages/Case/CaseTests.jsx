import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, FileText, X, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTest, setGameStatus, toggleAudioPaused } from '@/store/slices/gameSlice';
import { cleanText } from '@/lib/utils';
import { Markdown } from '@/components/Markdown';
import { useScreenAudio, useTapSound } from '@/lib/useAudio';

export default function CaseTests() {
    const { id: caseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { caseData, selectedTestIds, voiceId, audioPaused } = useAppSelector((state) => state.game);
    const isAudioEnabled = !audioPaused;

    const labAudio = useScreenAudio(isAudioEnabled ? voiceId : null, 'lab');
    const { playTap } = useTapSound();

    const handleToggleAudio = useCallback(() => {
        if (isAudioEnabled) {
            labAudio.stop();
        }
        dispatch(toggleAudioPaused());
    }, [isAudioEnabled, labAudio, dispatch]);

    const [showReportsModal, setShowReportsModal] = useState(false);
    const [currentReportIndex, setCurrentReportIndex] = useState(0);

    const tests = caseData?.steps?.[1]?.data?.availableTests || [];

    const testsById = useMemo(() => {
        const map = new Map();
        for (const t of tests) {
            map.set(t.testId, t);
        }
        return map;
    }, [tests]);

    const evaluatedResults = useMemo(() => {
        return selectedTestIds.map((id) => {
            const meta = testsById.get(id);
            return {
                id,
                name: cleanText(meta?.testName || id),
                value: cleanText(meta?.result || 'Result not available for this test.'),
            };
        });
    }, [selectedTestIds, testsById]);

    const handleToggleTest = (testId) => {
        playTap();
        dispatch(toggleTest(testId));
    };

    const handleGetReports = () => {
        if (selectedTestIds.length === 0) return;
        setCurrentReportIndex(0);
        setShowReportsModal(true);
    };

    const handleGiveDiagnosis = () => {
        setShowReportsModal(false);
        dispatch(setGameStatus('selecting_diagnosis'));
        navigate(`/play/case/${caseId}/diagnosis`);
    };

    const handleBack = () => {
        navigate(`/play/case/${caseId}?tab=3`);
    };

    if (!caseData) {
        navigate('/play');
        return null;
    }

    const TestCard = ({ test, isSelected }) => (
        <button
            onClick={() => handleToggleTest(test.testId)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                ? 'border-pink-500 bg-pink-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-pink-200 hover:shadow-sm'
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="font-medium text-gray-800">{cleanText(test.testName)}</p>
                </div>
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0 ${isSelected
                        ? 'border-pink-500 bg-pink-500'
                        : 'border-gray-300'
                        }`}
                >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
            </div>
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto pb-24 pt-3 px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-1.5 w-16 rounded-full bg-pink-500" />
                <div className="h-1.5 w-16 rounded-full bg-pink-500" />
                <div className="h-1.5 w-16 rounded-full bg-gray-200" />
                <div className="h-1.5 w-16 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex-1" />
                <h1 className="text-2xl font-bold text-gray-800">Order Lab Tests</h1>
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={handleToggleAudio}
                        className={`p-1.5 rounded-full transition-all ${isAudioEnabled
                            ? 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                    >
                        {isAudioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="space-y-3">
                    {tests.map((test) => (
                        <TestCard
                            key={test.testId}
                            test={test}
                            isSelected={selectedTestIds.includes(test.testId)}
                        />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 py-1.5 px-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handleBack}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                    >
                        <ChevronLeft className="h-4 w-4 text-pink-500" />
                    </button>

                    <button
                        onClick={handleGetReports}
                        disabled={selectedTestIds.length === 0}
                        className={`flex-1 py-2 px-5 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 transition ${selectedTestIds.length === 0
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Get Reports ({selectedTestIds.length})
                    </button>
                </div>
            </div>

            {showReportsModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowReportsModal(false)} />
                    <div className="relative w-full max-w-2xl bg-blue-50 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Reports ({evaluatedResults.length})</h2>
                            <button onClick={() => setShowReportsModal(false)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><X className="h-5 w-5 text-gray-600" /></button>
                        </div>
                        <div className="p-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {evaluatedResults.map((r, i) => (
                                <button
                                    key={r.id}
                                    onClick={() => setCurrentReportIndex(i)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${i === currentReportIndex ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border'}`}
                                >
                                    {r.name.split('(')[0].trim()}
                                </button>
                            ))}
                        </div>
                        <div className="p-4">
                            <div className="bg-white rounded-2xl p-6 shadow-md min-h-[140px]">
                                <Markdown>{evaluatedResults[currentReportIndex]?.value || 'No result available'}</Markdown>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 border-t border-gray-200">
                            <button onClick={() => setShowReportsModal(false)} className="px-5 py-2.5 rounded-xl border text-sm">Close</button>
                            <button onClick={handleGiveDiagnosis} className="flex-1 py-2.5 px-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold flex items-center justify-center gap-2 text-sm">
                                Give Diagnosis <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
