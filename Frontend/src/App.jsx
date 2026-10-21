import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import DiscoverPage from './pages/DiscoverPage';
import SavedActivitiesPage from './pages/SavedActivitiesPage';
import GroupDashboardPage from './pages/GroupDashboardPage';
import GroupSwipePage from './pages/GroupSwipePage';
import MatchResultPage from './pages/MatchResultPage';
import {
  Sparkles,
  Users,
  Compass,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
  LogIn,
  Bookmark,
  Calendar
} from 'lucide-react';

function LandingView() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-orange-500/20">
              HO
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">Hangin<span className="text-orange-500">Out</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs text-orange-400/80 font-medium bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                Phase 4 Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium"
            >
              <span>Swagger APIs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/discover"
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1 font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span>Solo Deck</span>
                </Link>
                <Link
                  to="/groups"
                  className="text-xs bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-orange-500/20 flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Squads</span>
                </Link>
                <Link
                  to="/saved"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  title="Saved Hangouts"
                >
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link
                  to="/profile"
                  className="text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1 font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg transition shadow-md shadow-orange-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Making memories shouldn't cost ₹1000</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Student hangout discovery & <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">collaborative group swiping</span>.
        </h1>

        <p className="mt-5 text-slate-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
          Tired of endless group chat debates? Create a squad, invite your friends with a 6-character code, swipe together, and unlock instant unanimous matches and scheduled hangout plans.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          {isAuthenticated ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/groups"
                className="flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5"
              >
                <Users className="w-4 h-4" />
                <span>Squad Swipes & Consensus</span>
              </Link>
              <Link
                to="/discover"
                className="flex items-center gap-2 py-3 px-5 rounded-xl font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition"
              >
                <Compass className="w-4 h-4 text-orange-400" />
                <span>Solo Deck</span>
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition"
              >
                <LogIn className="w-4 h-4 text-orange-400" />
                <span>Existing User Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Curated Spots Under ₹1000</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Verified street food alleys, board game cafes, bowling alleys, and cultural spots in your city tailored specifically for student budgets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Collaborative Squad Swiping</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create a squad with a 6-character code (e.g. HNG7342). All squad members swipe independently to eliminate group chat friction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Consensus & Scheduling</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unlock instant unanimous matches (100% agreed), ranked consensus percentages, and lock down planned dates and times.
            </p>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="mt-12 w-full p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Engineering Deliverables (Phases 1, 2, 3 & 4 Completed)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Squad Creation & Invite Codes (e.g. HNG9342 with creator auto-membership)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Group Voting & Real-Time Consensus Matching (Unanimous 100% & Ranked %)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Hangout Plan Scheduling & Itinerary Coordination (Date, Time, Location)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Rule-Based Recommendation Engine & Dual-State Swipe Deck</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Spring Security 6 Stateless JWT Auth & PostgreSQL Compatibility</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>22/22 Automated Integration & Context Tests Passing (0 failures, 0 errors)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>HanginOut Platform © 2026 — JIMS MCA Capstone Engineering Project.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/saved" element={<SavedActivitiesPage />} />
            <Route path="/groups" element={<GroupDashboardPage />} />
            <Route path="/groups/:id/swipe" element={<GroupSwipePage />} />
            <Route path="/groups/:id/matches" element={<MatchResultPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
