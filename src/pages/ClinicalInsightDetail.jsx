'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Markdown } from '@/components/Markdown';
import {
    ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Info,
    FlaskConical, Stethoscope, Pill, ChevronDown,
    Lightbulb, Target, TestTube, CheckCircle2,
    XCircle, Video, FileText, Download, RotateCcw, Home
} from 'lucide-react';
import { cleanText } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

/**
 * Clean PDF Slide Viewer
 */
function PdfSlideViewer({ url }) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(600);

    // In a real app, you might need a proxy. For now use direct URL or handled by server.
    // Vite handles external URLs usually fine if CORS permits.
    const finalUrl = url;

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    const goToPrevPage = () => setPageNumber(prev => Math.max(1, prev - 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(numPages, prev + 1));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 mb-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-orange-100 bg-orange-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-orange-800">Slide Deck</h3>
                        <span className="text-xs text-orange-600">
                            {isLoading ? 'Loading...' : `${pageNumber} / ${numPages}`}
                        </span>
                    </div>
                </div>
                <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition"
                >
                    <Download className="h-5 w-5 text-orange-600" />
                </a>
            </div>

            <div ref={containerRef} className="relative bg-gray-100 h-[420px] overflow-hidden">
                <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-200
                        hover:bg-orange-50 hover:scale-105 transition-all duration-200
                        ${pageNumber <= 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
                >
                    <ChevronLeft className="h-6 w-6 text-orange-600" />
                </button>

                <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-200
                        hover:bg-orange-50 hover:scale-105 transition-all duration-200
                        ${pageNumber >= numPages ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
                >
                    <ChevronRight className="h-6 w-6 text-orange-600" />
                </button>

                <div className="flex justify-center items-center h-full">
                    <Document
                        file={finalUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />}
                    >
                        <Page
                            pageNumber={pageNumber}
                            width={containerWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                </div>
            </div>

            {numPages > 1 && (
                <div className="flex justify-center items-center gap-2 h-12 bg-gray-50 border-t border-gray-100">
                    {Array.from({ length: numPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPageNumber(i + 1)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${pageNumber === i + 1 ? 'bg-orange-500' : 'bg-gray-300 hover:bg-orange-300'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

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

            {caseData?.videooverview && (
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 mb-4 overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-purple-50">
                        <div className="p-2 bg-purple-500 rounded-lg"><Video className="h-5 w-5 text-white" /></div>
                        <h3 className="font-bold text-purple-800">Video Overview</h3>
                    </div>
                    <div className="p-4"><video controls className="w-full rounded-xl bg-black aspect-video" src={caseData.videooverview} /></div>
                </div>
            )}

            {caseData?.slidedeck && <PdfSlideViewer url={caseData.slidedeck} />}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-100">
                <button
                    onClick={() => navigate('/play')}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-4 font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                    <Home className="h-5 w-5" /> Home
                </button>
                {gameplay?.caseId?._id && !gameplay.dailyChallengeId && (
                    <button
                        onClick={() => navigate(`/play/case/${gameplay.caseId._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl"
                    >
                        <RotateCcw className="h-5 w-5" /> Play Again
                    </button>
                )}
            </div>
        </div>
    );
}
