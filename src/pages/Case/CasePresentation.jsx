import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Thermometer, Heart, Droplet, Wind, Activity, Weight, User, Calendar, Loader2, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadCaseById, setCaseData, clearGame, toggleAudioPaused } from '@/store/slices/gameSlice';
import { useSwipeable } from 'react-swipeable';
import { cleanText } from '@/lib/utils';
import { Markdown } from '@/components/Markdown';
import { useCaseAudio } from '@/lib/useAudio';
import Image from '@/components/Image';

const SLIDE_COUNT = 4;
const SLIDE_TITLES = ['Basic Info & Chief Complaint', 'Vitals', 'History (Hx)', 'Physical Examination (PE)'];

// Section component matching mobile design
function Section({ title, children, audioControls }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    {audioControls && (
                        <div className="flex items-center gap-2">
                            {audioControls}
                        </div>
                    )}
                </div>
                <div className="mt-2 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {children}
            </div>
        </div>
    );
}

// Info column for patient details
function InfoColumn({ icon: Icon, label, value }) {
    return (
        <div className="flex flex-col items-center text-center">
            <Icon className="h-5 w-5 text-pink-500 mb-1" />
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
        </div>
    );
}

// Vital tile
function VitalTile({ icon: Icon, label, value }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
                <Icon className="h-4 w-4 text-pink-500" />
                <span className="text-xs text-gray-500">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{value}</span>
        </div>
    );
}

// Bullet item for history/exam
function BulletItem({ children }) {
    return (
        <div className="flex gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
            <span className="text-sm text-gray-700 leading-relaxed">{children}</span>
        </div>
    );
}

export default function CasePresentation() {
    const { id: caseId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const initialTab = searchParams.get('tab');

    const { caseData, status, error, audioPaused, caseId: reduxCaseId, dailyChallengeId: reduxDailyId } = useAppSelector((state) => state.game);
    const { hearts } = useAppSelector((state) => state.user);
    const isAudioEnabled = !audioPaused;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedPhysImageIndex, setSelectedPhysImageIndex] = useState(0);

    // Load case data
    useEffect(() => {
        const loadCase = async () => {
            if (!caseId) return;

            // Check if we need to load or reload data
            const isDataIncomplete = !caseData || !caseData.steps;
            const isDifferentCase = reduxCaseId !== caseId && reduxDailyId !== caseId;

            if (isDataIncomplete || isDifferentCase) {
                setIsLoading(true);
                setCurrentSlide(0);
                try {
                    await dispatch(loadCaseById(caseId)).unwrap();
                } catch (err) {
                    console.error('Failed to load case:', err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        loadCase();
    }, [caseId, reduxCaseId, caseData, dispatch]);

    // Extract data from case structure
    const step1Data = (caseData?.steps?.[0]?.data || {});
    const basicInfo = step1Data?.basicInfo || {};
    const chiefComplaint = step1Data?.chiefComplaint || '';
    const historyItems = step1Data?.history || [];
    const examItems = step1Data?.physicalExamination || [];
    const vitalsData = step1Data?.vitals || {};
    const mainImageUrl = caseData?.mainimage || '';
    const physicalImages = caseData?.physicalimage || [];

    // Use the caseId directly from case data for audio (e.g., "RHE002", "GASTRO001")
    const caseCode = caseData?.caseId || null;

    // Audio hook for case narration (uses case code, not MongoDB ID)
    const caseAudio = useCaseAudio(caseCode, {
        playbackRate: 1.25,
    });

    // Initialize slide from query param if present
    useEffect(() => {
        if (initialTab !== null) {
            const tabIndex = parseInt(initialTab);
            if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < SLIDE_COUNT) {
                setCurrentSlide(tabIndex);
            }
        }
    }, [initialTab]);

    // Auto-play audio when slide changes
    useEffect(() => {
        if (!isLoading && caseCode && isAudioEnabled) {
            caseAudio.stop();
            const timer = setTimeout(() => {
                caseAudio.playForSlide(currentSlide);
            }, 500);
            return () => clearTimeout(timer);
        } else if (!isAudioEnabled) {
            caseAudio.stop();
        }
    }, [currentSlide, isLoading, caseCode, isAudioEnabled]);


    // Vitals array
    const vitals = [
        { icon: Thermometer, label: 'Temperature', value: vitalsData.temperature },
        { icon: Heart, label: 'Heart Rate', value: vitalsData.heartRate },
        { icon: Droplet, label: 'Blood Pressure', value: vitalsData.bloodPressure },
        { icon: Wind, label: 'Respiratory Rate', value: vitalsData.respiratoryRate },
        { icon: Activity, label: 'O₂ Saturation', value: vitalsData.oxygenSaturation },
        { icon: Weight, label: 'Weight', value: vitalsData.weight },
    ].filter(v => v.value);

    // Navigation
    const handlePrev = useCallback(() => {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
    }, []);

    const handleNext = useCallback(() => {
        setCurrentSlide((prev) => Math.min(SLIDE_COUNT - 1, prev + 1));
    }, []);

    const handleClose = useCallback(() => {
        caseAudio.stop();
        dispatch(clearGame());
        navigate('/play');
    }, [dispatch, navigate, caseAudio]);

    const handleProceedToTests = useCallback(() => {
        caseAudio.stop();
        navigate(`/play/case/${caseId}/tests`);
    }, [caseId, navigate, caseAudio]);

    // Toggle audio enable/disable (persisted in Redux)
    const handleToggleAudio = useCallback(() => {
        if (isAudioEnabled) {
            caseAudio.stop();
        }
        dispatch(toggleAudioPaused());
    }, [isAudioEnabled, caseAudio, dispatch]);

    // Swipe handlers
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
    });

    // Audio controls element for card headers (only mute toggle)
    const audioControlsElement = (
        <button
            onClick={handleToggleAudio}
            className={`p-1.5 rounded-full transition-all ${isAudioEnabled
                ? 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
            title={isAudioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
            {isAudioEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
            ) : (
                <VolumeX className="h-3.5 w-3.5" />
            )}
        </button>
    );

    if (isLoading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading case...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 pb-5">
            <div className="max-w-2xl mx-auto px-4 pt-0">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-1.5 w-16 rounded-full bg-pink-500" />
                    <div className="h-1.5 w-16 rounded-full bg-gray-200" />
                    <div className="h-1.5 w-16 rounded-full bg-gray-200" />
                    <div className="h-1.5 w-16 rounded-full bg-gray-200" />
                </div>

                <div
                    {...swipeHandlers}
                    className="relative min-h-[600px] max-h-[1000px] touch-pan-y"
                >
                    {/* Slide 0: Basic Info */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Section title={SLIDE_TITLES[0]} audioControls={audioControlsElement}>
                            {mainImageUrl && (
                                <div className="relative w-full h-70 rounded-xl overflow-hidden mb-4 bg-gray-100">
                                    <Image
                                        src={mainImageUrl}
                                        alt="Case"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <InfoColumn icon={User} label="Name" value={basicInfo?.name || '—'} />
                                <InfoColumn icon={User} label="Sex" value={basicInfo?.gender || '—'} />
                                <InfoColumn icon={Calendar} label="Age" value={basicInfo?.age ? String(basicInfo.age) : '—'} />
                            </div>

                            <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                                    <span className="text-sm font-semibold text-pink-700">Chief Complaint</span>
                                </div>
                                <div className="text-gray-800">
                                    <Markdown>{chiefComplaint || '—'}</Markdown>
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Slide 1: Vitals */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Section title={SLIDE_TITLES[1]} audioControls={audioControlsElement}>
                            <div className="grid grid-cols-2 gap-3">
                                {vitals.map((v, i) => (
                                    <VitalTile key={i} icon={v.icon} label={v.label} value={v.value} />
                                ))}
                            </div>
                            {vitals.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No vitals data available</p>
                            )}
                        </Section>
                    </div>

                    {/* Slide 2: History */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Section title={SLIDE_TITLES[2]} audioControls={audioControlsElement}>
                            {historyItems.length > 0 ? (
                                <div className="space-y-4">
                                    {historyItems.map((h, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-semibold text-pink-600 mb-1">
                                                <Markdown>{h.category}</Markdown>
                                            </h4>
                                            <BulletItem>
                                                <Markdown>{h.detail}</Markdown>
                                            </BulletItem>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No history information available</p>
                            )}
                        </Section>
                    </div>

                    {/* Slide 3: Physical Examination */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <Section title={SLIDE_TITLES[3]} audioControls={audioControlsElement}>
                            {examItems.length > 0 ? (
                                <div className="space-y-2">
                                    {examItems.map((e, i) => (
                                        <BulletItem key={i}>
                                            <span className="font-medium">
                                                <Markdown className="inline">{e.system}</Markdown>:
                                            </span>{' '}
                                            <Markdown className="inline">{e.findings}</Markdown>
                                        </BulletItem>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No physical examination findings</p>
                            )}

                            {physicalImages.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSelectedPhysImageIndex(0);
                                        setIsImageModalOpen(true);
                                    }}
                                    className="mt-4 w-fit mx-auto py-2.5 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    View Images ({physicalImages.length})
                                </button>
                            )}
                        </Section>
                    </div>
                </div>

                {isImageModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsImageModalOpen(false)} />
                        <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-800">Physical Exam Images</h3>
                                    {physicalImages.length > 0 && (
                                        <span className="text-xs font-semibold text-gray-500">
                                            {selectedPhysImageIndex + 1} / {physicalImages.length}
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => setIsImageModalOpen(false)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="relative w-full aspect-video bg-gray-900 flex items-center justify-center group">
                                {physicalImages[selectedPhysImageIndex]?.url && (
                                    <>
                                        <Image src={physicalImages[selectedPhysImageIndex].url} alt="Exam" fill className="object-contain" unoptimized />
                                        {physicalImages.length > 1 && (
                                            <>
                                                <button onClick={() => setSelectedPhysImageIndex(p => Math.max(0, p - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80"><ChevronLeft className="h-4 w-4" /></button>
                                                <button onClick={() => setSelectedPhysImageIndex(p => Math.min(physicalImages.length - 1, p + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80"><ChevronRight className="h-4 w-4" /></button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full ${i === currentSlide ? 'bg-pink-500' : 'bg-gray-300'}`} />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 py-1.5 px-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    {currentSlide > 0 ? (
                        <button onClick={handlePrev} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition">
                            <ChevronLeft className="h-4 w-4 text-pink-500" />
                        </button>
                    ) : (
                        <div className="w-9" />
                    )}

                    {currentSlide === SLIDE_COUNT - 1 ? (
                        <button
                            onClick={handleProceedToTests}
                            className="flex-1 mx-4 py-2 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Send for Tests</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex-1 mx-4 py-2 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}

                    {currentSlide < SLIDE_COUNT - 1 ? (
                        <button onClick={handleNext} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition">
                            <ChevronRight className="h-4 w-4 text-pink-500" />
                        </button>
                    ) : (
                        <div className="w-9" />
                    )}
                </div>
            </div>
        </div>
    );
}
