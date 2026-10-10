import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';

// Code-split pages so the landing page bundle is ultra-lightweight
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AppLayout = lazy(() => import('./layouts/AppLayout'));
const DepartmentCasesPage = lazy(() => import('./pages/DepartmentCasesPage'));

// Case Ported Pages
const CasePresentation = lazy(() => import('./pages/Case/CasePresentation'));
const CaseTests = lazy(() => import('./pages/Case/CaseTests'));
const CaseDiagnosis = lazy(() => import('./pages/Case/CaseDiagnosis'));
const CaseTreatment = lazy(() => import('./pages/Case/CaseTreatment'));
const CaseResults = lazy(() => import('./pages/Case/CaseResults'));

// Clinical Insight Ported
const PastCases = lazy(() => import('./pages/PastCases'));
const ClinicalInsightDetail = lazy(() => import('./pages/ClinicalInsightDetail'));

// Leaderboard Ported
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const PastChallengesPage = lazy(() => import('./pages/PastChallengesPage'));

// Account Ported
const AccountPage = lazy(() => import('./pages/AccountPage'));
const EditAccountPage = lazy(() => import('./pages/EditAccountPage'));
const HeartsPage = lazy(() => import('./pages/HeartsPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));

// Static Pages
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
      <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();

  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* App Pages (Protected/Layout) */}
        <Route
          path="/play"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="department/:categoryId" element={<DepartmentCasesPage />} />

          {/* Case Gameplay Flow */}
          <Route path="case/:id" element={<CasePresentation />} />
          <Route path="case/:id/tests" element={<CaseTests />} />
          <Route path="case/:id/diagnosis" element={<CaseDiagnosis />} />
          <Route path="case/:id/treatment" element={<CaseTreatment />} />
          <Route path="case/:id/results" element={<CaseResults />} />

          {/* Clinical Insight */}
          <Route path="clinical-insight" element={<PastCases />} />
          <Route path="clinical-insight/:id" element={<ClinicalInsightDetail />} />

          {/* Leaderboard */}
          <Route path="leaderboard" element={<LeaderboardPage />} />

          {/* Account Section */}
          <Route path="account" element={<AccountPage />} />
          <Route path="account/edit" element={<EditAccountPage />} />
          <Route path="hearts" element={<HeartsPage />} />
          <Route path="premium" element={<PremiumPage />} />

          {/* Other Sections */}
          <Route path="past-challenges" element={<PastChallengesPage />} />
        </Route>

        {/* Static Public Pages */}
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms/:lang?" element={<TermsPage />} />
        <Route path="/privacy/:lang?" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/prcing" element={<PricingPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
