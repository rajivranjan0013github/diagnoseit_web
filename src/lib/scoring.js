// Scoring utility: normalized to 30/40/30 for tests/diagnosis/treatments
// Ported from mobile app: gtdfront/src/services/scoring.js

function toSet(arr) {
    return new Set(Array.isArray(arr) ? arr : []);
}

function countIntersect(a, b) {
    let count = 0;
    for (const x of a) if (b.has(x)) count++;
    return count;
}

function countMinus(a, b) {
    let count = 0;
    for (const x of a) if (!b.has(x)) count++;
    return count;
}

export function computeGameplayScoreNormalized(caseData, selections) {
    const { selectedTestIds, selectedDiagnosisId, selectedTreatmentIds } = selections;

    // 1) Extract ground truth from caseData
    const tests = caseData?.steps?.[1]?.data?.availableTests || [];
    const diags = caseData?.steps?.[2]?.data?.diagnosisOptions || [];
    const treatmentGroups = caseData?.steps?.[3]?.data?.treatmentOptions || {};
    const allTreatments = [
        ...(treatmentGroups.medications || []),
        ...(treatmentGroups.surgicalInterventional || []),
        ...(treatmentGroups.nonSurgical || []),
        ...(treatmentGroups.psychiatric || []),
    ];

    // For lab tests, treat isRelevant === true OR isCorrect === true as correct
    const correctTestIds = tests
        .filter(t => t.isCorrect === true || t.isRelevant === true)
        .map(t => t.testId);

    const correctDiagnosis = diags.find(d => d.isCorrect === true);
    const correctDiagnosisId = correctDiagnosis?.diagnosisId;

    const correctTreatmentIds = allTreatments
        .filter(t => t.isCorrect === true)
        .map(t => t.treatmentId);

    // 2) Build sets
    const selTests = toSet(selectedTestIds);
    const selTreats = toSet(selectedTreatmentIds);
    const correctTests = toSet(correctTestIds);
    const correctTreats = toSet(correctTreatmentIds);

    // 3) Raw scores
    const testsCorrect = countIntersect(selTests, correctTests);
    const testsMissed = countMinus(correctTests, selTests);
    const testsUnnecessary = countMinus(selTests, correctTests);

    const rawLabScore = 3 * testsCorrect - 2 * testsMissed - 1 * testsUnnecessary;
    const rawDiagScore = selectedDiagnosisId && correctDiagnosisId && selectedDiagnosisId === correctDiagnosisId ? 10 : 0;

    const medsCorrect = countIntersect(selTreats, correctTreats);
    const medsMissed = countMinus(correctTreats, selTreats);
    const medsUnnecessary = countMinus(selTreats, correctTreats);

    const rawMedScore = 3 * medsCorrect - 2 * medsMissed - 1 * medsUnnecessary;

    // 4) Normalization to 30/40/30
    const maxPossibleLabScore = (correctTestIds.length || 0) * 3;
    const maxPossibleMedScore = (correctTreatmentIds.length || 0) * 3;

    const lab = maxPossibleLabScore > 0 ? (rawLabScore / maxPossibleLabScore) * 30 : 0;
    const diagnosis = (rawDiagScore / 10) * 40; // 10 is the max for diagnosis correct
    const meds = maxPossibleMedScore > 0 ? (rawMedScore / maxPossibleMedScore) * 30 : 0;

    const total = (lab || 0) + (diagnosis || 0) + (meds || 0);

    return {
        total: Math.round(total * 100) / 100,
        tests: Math.round(lab * 100) / 100,
        diagnosis: Math.round(diagnosis * 100) / 100,
        treatment: Math.round(meds * 100) / 100,
    };
}

// Helper to get correct answers for display
export function getCorrectAnswers(caseData) {
    const tests = caseData?.steps?.[1]?.data?.availableTests || [];
    const diags = caseData?.steps?.[2]?.data?.diagnosisOptions || [];
    const treatmentGroups = caseData?.steps?.[3]?.data?.treatmentOptions || {};
    const allTreatments = [
        ...(treatmentGroups.medications || []),
        ...(treatmentGroups.surgicalInterventional || []),
        ...(treatmentGroups.nonSurgical || []),
        ...(treatmentGroups.psychiatric || []),
    ];

    return {
        correctTests: tests.filter(t => t.isCorrect === true || t.isRelevant === true),
        correctDiagnosis: diags.find(d => d.isCorrect === true),
        correctTreatments: allTreatments.filter(t => t.isCorrect === true),
    };
}
