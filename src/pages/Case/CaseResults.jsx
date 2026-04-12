import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, ArrowRight, Home, RotateCcw, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearGame } from '@/store/slices/gameSlice';
import { getCorrectAnswers } from '@/lib/scoring';

export default function CaseResults() {
    const { id: caseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { caseData, selectedTestIds, selectedDiagnosisId, selectedTreatmentIds, scoreResult, lastSubmittedGameplayId } =
        useAppSelector((state) => state.game);

    if (!caseData || !scoreResult) {
        navigate('/play');
        return null;
    }

    const { correctTests, correctDiagnosis, correctTreatments } = getCorrectAnswers(caseData);

    const tests = caseData?.steps?.[1]?.data?.availableTests || [];
    const diagnoses = caseData?.steps?.[2]?.data?.diagnosisOptions || [];
    const treatmentOptions = caseData?.steps?.[3]?.data?.treatmentOptions;
    const allTreatments = [
        ...(treatmentOptions?.medications || []),
        ...(treatmentOptions?.surgicalInterventional || []),
        ...(treatmentOptions?.nonSurgical || []),
        ...(treatmentOptions?.psychiatric || []),
    ];

    const selectedDiagnosis = diagnoses.find((d) => d.diagnosisId === selectedDiagnosisId);
    const isDiagnosisCorrect = selectedDiagnosisId === correctDiagnosis?.diagnosisId;

    const getScoreColor = (score, max) => {
        const ratio = score / max;
        if (ratio >= 0.8) return 'text-green-600';
        if (ratio >= 0.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handlePlayAgain = () => {
        dispatch(clearGame());
        navigate(`/play/case/${caseId}`);
    };

    const handleGoHome = () => {
        dispatch(clearGame());
        navigate('/play');
    };

    const totalPossible = 100;
    const scorePercentage = Math.round((scoreResult.total / totalPossible) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-8 px-4">
            <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white text-center shadow-xl">
                <div className="mb-4">
                    <Trophy className="h-16 w-16 mx-auto mb-2 text-yellow-300" />
                    <h1 className="text-3xl font-bold">Case Complete!</h1>
                </div>
                <div className="text-6xl font-bold mb-2">
                    {Math.round(scoreResult.total)}<span className="text-2xl opacity-80">/{totalPossible}</span>
                </div>
                <p className="text-lg opacity-90">
                    {scorePercentage >= 80 ? 'Excellent work, Doctor! 🎉' : scorePercentage >= 50 ? 'Good effort! Keep practicing.' : 'Room for improvement. Review the case.'}
                </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Score Breakdown</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50">
                        <div><p className="font-semibold text-gray-800">Diagnostic Tests</p><p className="text-sm text-gray-500">Ordered relevant tests</p></div>
                        <div className={`text-2xl font-bold ${getScoreColor(scoreResult.tests, 30)}`}>{Math.round(scoreResult.tests)}/30</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-pink-50">
                        <div><p className="font-semibold text-gray-800">Diagnosis</p><p className="text-sm text-gray-500">Correct diagnosis</p></div>
                        <div className={`text-2xl font-bold ${getScoreColor(scoreResult.diagnosis, 40)}`}>{Math.round(scoreResult.diagnosis)}/40</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-green-50">
                        <div><p className="font-semibold text-gray-800">Treatment</p><p className="text-sm text-gray-500">Appropriate treatments</p></div>
                        <div className={`text-2xl font-bold ${getScoreColor(scoreResult.treatment, 30)}`}>{Math.round(scoreResult.treatment)}/30</div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Diagnosis Review</h2>
                <div className={`p-4 rounded-xl border-2 ${isDiagnosisCorrect ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        {isDiagnosisCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                        <span className="text-sm font-medium text-gray-600">Your Answer</span>
                    </div>
                    <p className="font-semibold text-gray-800">{selectedDiagnosis?.diagnosisName || 'No diagnosis selected'}</p>
                </div>
                {!isDiagnosisCorrect && correctDiagnosis && (
                    <div className="mt-3 p-4 rounded-xl border-2 border-green-500 bg-green-50">
                        <div className="flex items-center gap-2 mb-1"><CheckCircle className="h-5 w-5 text-green-600" /><span className="text-sm font-medium text-gray-600">Correct Answer</span></div>
                        <p className="font-semibold text-gray-800">{correctDiagnosis.diagnosisName}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={handleGoHome} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-4 font-semibold text-gray-700 transition hover:bg-gray-200">
                    <Home className="h-5 w-5" /> Home
                </button>
                <button onClick={handlePlayAgain} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl">
                    <RotateCcw className="h-5 w-5" /> Play Again
                </button>
            </div>
        </div>
    );
}
