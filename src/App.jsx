import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AppLayout from './layouts/AppLayout';
import DepartmentCasesPage from './pages/DepartmentCasesPage';

// Case Ported Pages
import CasePresentation from './pages/Case/CasePresentation';
import CaseTests from './pages/Case/CaseTests';
import CaseDiagnosis from './pages/Case/CaseDiagnosis';
import CaseTreatment from './pages/Case/CaseTreatment';
import CaseResults from './pages/Case/CaseResults';

// Clinical Insight Ported
import PastCases from './pages/PastCases';
import ClinicalInsightDetail from './pages/ClinicalInsightDetail';

// Leaderboard Ported
import LeaderboardPage from './pages/LeaderboardPage';
import PastChallengesPage from './pages/PastChallengesPage';

// Account Ported
import AccountPage from './pages/AccountPage';
import EditAccountPage from './pages/EditAccountPage';
import HeartsPage from './pages/HeartsPage';
import PremiumPage from './pages/PremiumPage';

// Static Pages
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Other pages (stubs for now)

function ProtectedRoute({ children }) {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();

  if (!userData) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
