import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Volume2, VolumeX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedDiagnosis, setGameStatus, toggleAudioPaused } from '@/store/slices/gameSlice';
import { cleanText } from '@/lib/utils';
import { Markdown } from '@/components/Markdown';
import { useScreenAudio, useTapSound } from '@/lib/useAudio';

export default function CaseDiagnosis() {
    const { id: caseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { caseData, selectedDiagnosisId, voiceId, audioPaused } = useAppSelector((state) => state.game);
    const isAudioEnabled = !audioPaused;

    const diagnosisAudio = useScreenAudio(isAudioEnabled ? voiceId : null, 'diagnosis');
    const { playTap } = useTapSound();

    const handleToggleAudio = useCallback(() => {
        if (isAudioEnabled) {
            diagnosisAudio.stop();
        }
        dispatch(toggleAudioPaused());
    }, [isAudioEnabled, diagnosisAudio, dispatch]);

    const diagnosisOptions = caseData?.steps?.[2]?.data?.diagnosisOptions || [];

    const handleSelectDiagnosis = (diagnosisId) => {
        playTap();
        dispatch(setSelectedDiagnosis(diagnosisId));
    };

    const handleContinue = () => {
        if (!selectedDiagnosisId) {
            alert('Please select a diagnosis before continuing.');
            return;
        }
        dispatch(setGameStatus('selecting_treatment'));
        navigate(`/play/case/${caseId}/treatment`);
    };

    const handleBack = () => {
        navigate(`/play/case/${caseId}/tests`);
    };

    if (!caseData) {
        navigate('/play');
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4 pb-24 pt-3 px-4">
            <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-pink-500" />
                <div className="h-1.5 w-16 rounded-full bg-pink-500" />
                <div className="h-1.5 w-16 rounded-full bg-pink-500" />
                <div className="h-1.5 w-16 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-1" />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Select Diagnosis</h1>
                    <p className="text-gray-600 mt-2">Based on your findings, what is your diagnosis?</p>
                </div>
                <div className="flex-1 flex justify-end">
                    <button onClick={handleToggleAudio} className={`p-1.5 rounded-full transition-all ${isAudioEnabled ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'bg-gray-100 text-gray-400'}`}>
                        {isAudioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="space-y-3">
                    {diagnosisOptions.map((diagnosis) => (
                        <button
                            key={diagnosis.diagnosisId}
                            onClick={() => handleSelectDiagnosis(diagnosis.diagnosisId)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedDiagnosisId === diagnosis.diagnosisId ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-gray-200 bg-white hover:border-pink-200'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{cleanText(diagnosis.diagnosisName)}</p>
                                    {diagnosis.description && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            <Markdown>{diagnosis.description}</Markdown>
                                        </div>
                                    )}
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 ${selectedDiagnosisId === diagnosis.diagnosisId ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                                    {selectedDiagnosisId === diagnosis.diagnosisId && <Check className="h-4 w-4 text-white" />}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 py-1.5 px-4 shadow-sm">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={handleBack} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <ChevronLeft className="h-4 w-4 text-pink-500" />
                    </button>
                    <button onClick={handleContinue} disabled={!selectedDiagnosisId} className="flex-1 py-2 px-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-bold shadow-md disabled:opacity-50 text-sm">
                        Confirm Diagnosis
                    </button>
                    <div className="w-9" />
                </div>
            </div>
        </div>
    );
}
