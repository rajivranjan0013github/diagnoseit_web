import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pill, Syringe, Bandage, Brain, ChevronRight, ChevronLeft, Check, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTreatment, submitCurrentGameplay, toggleAudioPaused } from '@/store/slices/gameSlice';
import { useHeart } from '@/store/slices/userSlice';
import { cleanText } from '@/lib/utils';
import { Markdown } from '@/components/Markdown';
import { useScreenAudio, useTapSound } from '@/lib/useAudio';

export default function CaseTreatment() {
    const { id: caseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { caseData, selectedTreatmentIds, status, voiceId, audioPaused, isBackdatePlay } = useAppSelector((state) => state.game);
    const { isPremium } = useAppSelector((state) => state.user);
    const isAudioEnabled = !audioPaused;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const treatmentAudio = useScreenAudio(isAudioEnabled ? voiceId : null, 'treatment');
    const { playTap } = useTapSound();

    const handleToggleAudio = useCallback(() => {
        if (isAudioEnabled) {
            treatmentAudio.stop();
        }
        dispatch(toggleAudioPaused());
    }, [isAudioEnabled, treatmentAudio, dispatch]);

    const treatmentOptions = caseData?.steps?.[3]?.data?.treatmentOptions;
    const medications = treatmentOptions?.medications || [];
    const surgicalInterventional = treatmentOptions?.surgicalInterventional || [];
    const nonSurgical = treatmentOptions?.nonSurgical || [];
    const psychiatric = treatmentOptions?.psychiatric || [];

    const handleToggleTreatment = (treatmentId) => {
        playTap();
        dispatch(toggleTreatment(treatmentId));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await dispatch(submitCurrentGameplay()).unwrap();
            const gameplayId = result.gameplayId;

            // CONSUME HEART (Match mobile app: consume at the end)
            if (!isPremium && !isBackdatePlay) {
                try {
                    await dispatch(useHeart()).unwrap();
                } catch (err) {
                    console.error('Failed to consume heart:', err);
                }
            }

            // Redirect to clinical insight instead of result, using replace to avoid backing into the form
            navigate(`/play/clinical-insight/${gameplayId}?finish=true`, { replace: true });
        } catch (err) {
            console.error('Failed to submit gameplay:', err);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(`/play/case/${caseId}/diagnosis`);
    };

    if (!caseData) {
        navigate('/play');
        return null;
    }

    const TreatmentSection = ({ title, icon: Icon, treatments, iconColor, bgColor }) => {
        if (treatments.length === 0) return null;
        return (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className={`rounded-lg ${bgColor} p-2`}><Icon className={`h-5 w-5 ${iconColor}`} /></div>
                    {title}
                </h2>
                <div className="space-y-3">
                    {treatments.map((t) => (
                        <button
                            key={t.treatmentId}
                            onClick={() => handleToggleTreatment(t.treatmentId)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedTreatmentIds.includes(t.treatmentId) ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-gray-200 bg-white hover:border-pink-200'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{cleanText(t.treatmentName)}</p>
                                    {t.description && <div className="text-sm text-gray-500 mt-1"><Markdown>{t.description}</Markdown></div>}
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 ${selectedTreatmentIds.includes(t.treatmentId) ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                                    {selectedTreatmentIds.includes(t.treatmentId) && <Check className="h-4 w-4 text-white" />}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 pb-24 pt-3 px-4">
            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-1.5 w-16 rounded-full bg-pink-500" />)}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-1" />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Give Treatment</h1>
                    <p className="text-gray-600 mt-2">What treatments would you prescribe for this patient?</p>
                </div>
                <div className="flex-1 flex justify-end">
                    <button onClick={handleToggleAudio} className={`p-1.5 rounded-full transition-all ${isAudioEnabled ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'bg-gray-100 text-gray-400'}`}>
                        {isAudioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            <TreatmentSection title="Medications" icon={Pill} treatments={medications} iconColor="text-blue-600" bgColor="bg-blue-100" />
            <TreatmentSection title="Surgical & Interventional" icon={Syringe} treatments={surgicalInterventional} iconColor="text-red-600" bgColor="bg-red-100" />
            <TreatmentSection title="Non-Surgical Treatments" icon={Bandage} treatments={nonSurgical} iconColor="text-green-600" bgColor="bg-green-100" />
            <TreatmentSection title="Psychiatric & Supportive" icon={Brain} treatments={psychiatric} iconColor="text-purple-600" bgColor="bg-purple-100" />

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 py-1.5 px-4 shadow-sm">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={handleBack} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"><ChevronLeft className="h-4 w-4 text-pink-500" /></button>
                    <button onClick={handleSubmit} disabled={isSubmitting || selectedTreatmentIds.length === 0} className="flex-1 py-2 px-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <>Initiate Treatment <ChevronRight className="h-4 w-4" /></>}
                    </button>
                    <div className="w-9" />
                </div>
            </div>
        </div>
    );
}
