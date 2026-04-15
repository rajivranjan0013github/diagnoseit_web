'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Markdown } from '@/components/Markdown';
import {
    ChevronLeft, CheckCircle, AlertCircle, Info,
    FlaskConical, Stethoscope, Pill, ChevronDown,
    Lightbulb, Target, TestTube, CheckCircle2,
    XCircle
} from 'lucide-react';
import { cleanText } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

/**
 * Animated number component for smooth score counting
 */
function AnimatedNumber({ value, duration = 800, prefix = '', suffix = '' }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const startValue = 0;
        const endValue = value;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easedProgress * (endValue - startValue) + startValue);

            setDisplayValue(current);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value, duration]);

    return <span>{prefix}{displayValue}{suffix}</span>;
}

/**
 * Section card for displaying feedback on user choices
 */
const SectionCard = ({ kind, title, items }) => {
    const styles = {
        success: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, iconColor: 'text-green-600', textColor: 'text-green-800' },
        error: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, iconColor: 'text-red-600', textColor: 'text-red-800' },
        info: { bg: 'bg-amber-50', border: 'border-amber-200', icon: Info, iconColor: 'text-amber-600', textColor: 'text-amber-800' },
    };
    const style = styles[kind];
    const Icon = style.icon;

    return (
        <div className={`${style.bg} ${style.border} border rounded-xl p-4 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${style.iconColor}`} />
                <h4 className={`font-bold ${style.textColor}`}>{title}</h4>
            </div>
            <ul className="space-y-1 ml-7">
                {items.map((item, i) => (
                    <li key={i} className="text-gray-700 text-sm">
                        • <Markdown className="inline">{item}</Markdown>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Accordion section for clinical insights
 */
const InsightSection = ({
    title,
    icon: Icon,
    iconBg,
    textColor = 'text-gray-800',
    expanded,
    onToggle,
    children
}) => {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!contentRef.current) return;

        const updateHeight = () => {
            if (contentRef.current) {
                setHeight(contentRef.current.scrollHeight);
            }
        };

        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(contentRef.current);

        return () => resizeObserver.disconnect();
    }, [children]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${iconBg}`}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className={`font-bold ${textColor}`}>{title}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
            <div
                className="overflow-hidden transition-[height] duration-300 ease-in-out"
                style={{ height: expanded ? height : 0 }}
            >
                <div ref={contentRef} className="px-4 pb-4 border-t border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
};


export default function ClinicalInsightDetail() {
    const { id: gameplayId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isFinish = searchParams.get('finish') === 'true';
    const { audioPaused } = useAppSelector((state) => state.game);

    const [gameplay, setGameplay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('diagnosis');
    const [expandedSections, setExpandedSections] = useState({
        coreInsights: true,
        howLanded: false,
        rationale: false,
        treatment: false,
        whyOther: false,
    });

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

    useEffect(() => {
        const fetchGameplay = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/gameplays/${gameplayId}`);
                if (!res.ok) throw new Error('Failed to load gameplay');
                const data = await res.json();
                setGameplay(data.gameplay);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGameplay();
    }, [gameplayId, API_BASE]);

    const caseData = useMemo(() => {
        if (!gameplay) return null;
        return gameplay.sourceType === 'dailyChallenge' ? gameplay.dailyChallengeId?.caseData : gameplay.caseId?.caseData;
    }, [gameplay]);

    const sections = useMemo(() => {
        const sec = { tests: [], diagnosis: [], treatment: [] };
        if (!caseData || !gameplay) return sec;

        // Tests
        const availableTests = caseData.steps?.[1]?.data?.availableTests || [];
        const selectedTestIndices = gameplay.selections?.testIndices || [];
        const selectedTests = selectedTestIndices.map(i => availableTests[i]).filter(Boolean);
        const correctTests = selectedTests.filter(t => t.isRelevant);
        const unnecessaryTests = selectedTests.filter(t => !t.isRelevant);
        const missedTests = availableTests.filter((t, i) => t.isRelevant && !selectedTestIndices.includes(i));

        if (correctTests.length) sec.tests.push({ kind: 'success', title: 'Efficient Test Choices', items: correctTests.map(t => t.testName) });
        if (unnecessaryTests.length) sec.tests.push({ kind: 'error', title: 'Unnecessary Tests Ordered', items: unnecessaryTests.map(t => t.testName) });
        if (missedTests.length) sec.tests.push({ kind: 'info', title: 'Missed Key Tests', items: missedTests.map(t => t.testName) });

        // Diagnosis
        const diagOptions = caseData.steps?.[2]?.data?.diagnosisOptions || [];
        const selectedDiagIndex = gameplay.selections?.diagnosisIndex;
        const userDiag = typeof selectedDiagIndex === 'number' ? diagOptions[selectedDiagIndex] : null;
        const correctDiag = diagOptions.find(d => d.isCorrect);

        if (userDiag) sec.diagnosis.push({ kind: userDiag.isCorrect ? 'success' : 'error', title: 'Your Diagnosis', items: [userDiag.diagnosisName] });
        if (correctDiag) sec.diagnosis.push({ kind: 'info', title: 'Correct Diagnosis', items: [correctDiag.diagnosisName] });

        // Treatment
        const treatmentOptionsMap = caseData.steps?.[3]?.data?.treatmentOptions || {};
        const flatTreatments = [
            ...(treatmentOptionsMap.medications || []),
            ...(treatmentOptionsMap.surgicalInterventional || []),
            ...(treatmentOptionsMap.nonSurgical || []),
            ...(treatmentOptionsMap.psychiatric || []),
        ];
        const selectedTreatmentIndices = gameplay.selections?.treatmentIndices || [];
        const selectedTx = selectedTreatmentIndices.map(i => flatTreatments[i]).filter(Boolean);
        const correctTx = selectedTx.filter(t => t.isCorrect);
        const unnecessaryTx = selectedTx.filter(t => !t.isCorrect);
        const missedTx = flatTreatments.filter((t, i) => t.isCorrect && !selectedTreatmentIndices.includes(i));

        if (correctTx.length) sec.treatment.push({ kind: 'success', title: 'Correct Treatments', items: correctTx.map(t => t.treatmentName) });
        if (unnecessaryTx.length) sec.treatment.push({ kind: 'error', title: 'Unnecessary Treatments', items: unnecessaryTx.map(t => t.treatmentName) });
        if (missedTx.length) sec.treatment.push({ kind: 'info', title: 'Missed Treatments', items: missedTx.map(t => t.treatmentName) });

        return sec;
    }, [caseData, gameplay]);

    const correctDiagnosisName = useMemo(() => {
        const diagOptions = caseData?.steps?.[2]?.data?.diagnosisOptions || [];
        return diagOptions.find(d => d.isCorrect)?.diagnosisName || '';
    }, [caseData]);

    const caseReview = useMemo(() => (caseData?.steps?.[4]?.data || null), [caseData]);

    const coreInsightsList = useMemo(() => {
        const review = caseReview?.coreClinicalInsight;
        if (!review) return [];
        const out = [];
        if (review.correctDiagnosis) out.push({ title: 'Correct Diagnosis', content: review.correctDiagnosis });
        if (review.keyClues) out.push({ title: 'Key Clues', content: review.keyClues });
        if (review.essentialTests) out.push({ title: 'Essential Tests', content: review.essentialTests });
        if (Array.isArray(review.trapsToAvoid) && review.trapsToAvoid.length) out.push({ title: 'Pitfalls to Avoid', content: '• ' + review.trapsToAvoid.join('\n• ') });
        return out;
    }, [caseReview]);

    const scores = gameplay?.points || { total: 0, tests: 0, diagnosis: 0, treatment: 0 };

    if (loading) return <div className="max-w-3xl mx-auto py-20 text-center"><div className="animate-spin h-10 w-10 border-b-2 border-pink-500 mx-auto" /></div>;
    if (error) return <div className="max-w-3xl mx-auto py-20 px-4"><div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">{error}</div></div>;

    const howLandedItems = caseReview?.howWeLandedOnTheDiagnosis || [];
    const rationaleItems = caseReview?.rationaleBehindTestSelection || [];
    const treatmentPriorityItems = caseReview?.treatmentPriorityAndSequencing || [];
    const whyOtherItems = caseReview?.whyOtherDiagnosesDidntFit || [];

    return (
        <div className="max-w-3xl mx-auto pb-20 pt-4 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => isFinish ? navigate('/play') : navigate(-1)}
                    className="p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-sm border border-gray-100"
                >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Clinical Insight</h1>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 mb-6 text-white shadow-lg text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle className="h-24 w-24 -rotate-12" /></div>
                <h1 className="text-3xl font-bold mb-2">
                    {isFinish ? <AnimatedNumber value={Math.round(scores.total)} prefix="Score: " suffix=" / 100" /> : `Score: ${Math.round(scores.total)} / 100`}
                </h1>
                {correctDiagnosisName && (
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mt-1">
                        <CheckCircle className="h-5 w-5" /><Markdown className="font-medium text-white">{correctDiagnosisName}</Markdown>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="flex items-center gap-2 p-4 border-b">
                    <div className="p-2 bg-blue-100 rounded-lg"><Stethoscope className="h-5 w-5 text-blue-600" /></div>
                    <h2 className="font-bold text-gray-800">CASE REVIEW</h2>
                </div>
                <div className="flex border-b">
                    {['tests', 'diagnosis', 'treatment'].map((tab) => {
                        const score = scores[tab] || 0;
                        const max = tab === 'diagnosis' ? 40 : 30;
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-4 text-center font-semibold transition border-b-2 ${activeTab === tab ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                <div className="capitalize">{tab}</div>
                                <div className={`text-xs mt-1 ${activeTab === tab ? 'text-pink-500' : 'text-gray-400'}`}>{Math.round(score)}/{max}</div>
                            </button>
                        );
                    })}
                </div>
                <div className="p-4">
                    {sections[activeTab].length === 0 ? <p className="text-gray-500 text-center py-4">No specific feedback items</p> : sections[activeTab].map((s, i) => <SectionCard key={i} {...s} />)}
                </div>
            </div>

            {coreInsightsList.length > 0 && (
                <InsightSection title="Core Clinical Insights" icon={Lightbulb} iconBg="bg-green-500" expanded={expandedSections.coreInsights} onToggle={() => setExpandedSections(p => ({ ...p, coreInsights: !p.coreInsights }))}>
                    <div className="pt-4 space-y-4">
                        {coreInsightsList.map((ins, i) => (
                            <div key={i}><h5 className="font-bold text-gray-700 mb-1">{ins.title}</h5><div className="text-gray-600 text-sm whitespace-pre-wrap"><Markdown>{ins.content}</Markdown></div></div>
                        ))}
                    </div>
                </InsightSection>
            )}

            {howLandedItems.length > 0 && (
                <InsightSection title="How We Landed on the Diagnosis" icon={Target} iconBg="bg-blue-500" textColor="text-blue-800" expanded={expandedSections.howLanded} onToggle={() => setExpandedSections(p => ({ ...p, howLanded: !p.howLanded }))}>
                    <div className="pt-4 space-y-3">
                        {howLandedItems.map((item, i) => (
                            <div key={i} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" /><div className="text-gray-600 text-sm"><Markdown>{item}</Markdown></div></div>
                        ))}
                    </div>
                </InsightSection>
            )}

            {rationaleItems.length > 0 && (
                <InsightSection title="Logic Behind Test Selection" icon={TestTube} iconBg="bg-orange-500" textColor="text-orange-800" expanded={expandedSections.rationale} onToggle={() => setExpandedSections(p => ({ ...p, rationale: !p.rationale }))}>
                    <div className="pt-4 space-y-3">
                        {rationaleItems.map((item, i) => (
                            <div key={i} className="bg-orange-50 rounded-lg p-3 text-gray-600 text-sm"><Markdown>{item}</Markdown></div>
                        ))}
                    </div>
                </InsightSection>
            )}

            {treatmentPriorityItems.length > 0 && (
                <InsightSection title="Treatment Priority & Sequencing" icon={Pill} iconBg="bg-purple-500" textColor="text-purple-800" expanded={expandedSections.treatment} onToggle={() => setExpandedSections(p => ({ ...p, treatment: !p.treatment }))}>
                    <div className="pt-4 space-y-3">
                        {treatmentPriorityItems.map((item, i) => (
                            <div key={i} className="flex gap-3"><div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div><div className="text-gray-600 text-sm mt-0.5"><Markdown>{item}</Markdown></div></div>
                        ))}
                    </div>
                </InsightSection>
            )}

            {whyOtherItems.length > 0 && (
                <InsightSection title="Why Other Diagnoses Didn't Fit" icon={XCircle} iconBg="bg-red-500" textColor="text-red-800" expanded={expandedSections.whyOther} onToggle={() => setExpandedSections(p => ({ ...p, whyOther: !p.whyOther }))}>
                    <div className="pt-4 space-y-3">
                        {whyOtherItems.map((item, i) => (
                            <div key={i} className="bg-red-50 rounded-lg p-3">
                                <p className="font-semibold text-red-800"><Markdown>{item.diagnosisName || 'Alternative'}</Markdown></p>
                                {item.reasoning && <div className="text-gray-600 text-sm mt-1">• <Markdown className="inline">{item.reasoning}</Markdown></div>}
                            </div>
                        ))}
                    </div>
                </InsightSection>
            )}


            <div className="pt-6 mt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500 mb-4">Get a better experience on the app</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.thousandways.gtd1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-black py-3 px-4 transition hover:bg-gray-900"
                    >
                        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="white">
                            <path d="M3.18 23.76c.3.17.65.19.97.07l11.46-6.62-2.5-2.5-9.93 9.05zM.5 1.4C.19 1.73 0 2.24 0 2.9v18.2c0 .66.19 1.17.5 1.5l.08.07 10.2-10.2v-.24L.58 1.33.5 1.4zM20.1 10.4l-2.9-1.67-2.8 2.8 2.8 2.8 2.92-1.68c.83-.48.83-1.27-.02-1.75zM4.15.24L15.61 6.86l-2.5 2.5L3.18.31A1.04 1.04 0 014.15.24z"/>
                        </svg>
                        <div className="text-left">
                            <p className="text-white/70 text-xs leading-none">GET IT ON</p>
                            <p className="text-white font-semibold text-sm leading-tight">Google Play</p>
                        </div>
                    </a>
                    <a
                        href="https://apps.apple.com/app/id6746632892"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-black py-3 px-4 transition hover:bg-gray-900"
                    >
                        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="white">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.78M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <div className="text-left">
                            <p className="text-white/70 text-xs leading-none">DOWNLOAD ON THE</p>
                            <p className="text-white font-semibold text-sm leading-tight">App Store</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
