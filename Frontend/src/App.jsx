import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import DiscoverPage from './pages/DiscoverPage';
import SavedActivitiesPage from './pages/SavedActivitiesPage';
import GroupDashboardPage from './pages/GroupDashboardPage';
import GroupSwipePage from './pages/GroupSwipePage';
import MatchResultPage from './pages/MatchResultPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import {
  Sparkles,
  Users,
  Compass,
  Heart,
  ArrowRight,
  Shield,
  User,
  LogIn,
  Bookmark,
  Calendar
} from 'lucide-react';

function LandingView() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Luminous Ambient Blue Glow Mesh (Reference Visual Language) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#2b59ff]/30 via-[#1d4ed8]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-96 -right-40 w-[450px] h-[450px] bg-[#2b59ff]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="border-b border-blue-500/10 bg-[#0b0c12]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2b59ff] to-[#60a5fa] flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25">
              HO
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white">Hangin<span className="text-[#3b82f6]">Out</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {user?.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-xs bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 font-bold shadow-md shadow-purple-500/10"
                    title="System Administration Console"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to="/discover"
                  className="text-xs bg-[#131625] hover:bg-[#1a1e33] border border-blue-500/20 text-slate-200 px-4 py-2 rounded-full transition flex items-center gap-1.5 font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-[#60a5fa]" />
                  <span>Solo Deck</span>
                </Link>
                <Link
                  to="/groups"
                  className="btn-cobalt text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Groups</span>
                </Link>
                <Link
                  to="/saved"
                  className="p-2 rounded-full bg-[#131625] border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/30 transition"
                  title="Saved Hangouts"
                >
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link
                  to="/profile"
                  className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-slate-800/60 transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-cobalt text-xs px-4 py-2"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner with Screen 1 Aesthetic */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 flex flex-col items-center text-center relative z-10">
        {/* Brand Display Title in place of curve, matching the theme */}
        <div className="relative mb-8 flex flex-col items-center justify-center">
          <div className="text-6xl sm:text-8xl font-black tracking-tight select-none">
            <span className="text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.2)]">Hangin</span>
            <span className="bg-gradient-to-tr from-[#2B59FF] via-[#3870FF] to-[#60A5FA] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(43,89,255,0.7)]">Out</span>
            <span className="text-[#2B59FF] drop-shadow-[0_0_20px_rgba(43,89,255,0.9)]">.</span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight mb-4">
          Discover. Hang out. <span className="text-[#3b82f6]">Achieve.</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
          Find verified spots under ₹1000 across Delhi NCR and reach consensus in seconds.
        </p>

        {/* High-Contrast Action Pill Buttons (from Screen 1 & 3 of Reference) */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          {isAuthenticated ? (
            <>
              <Link
                to="/groups"
                className="btn-cobalt w-full sm:w-auto px-8 py-3.5 text-sm gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Group Swipes & Consensus</span>
              </Link>
              <Link
                to="/discover"
                className="btn-white w-full sm:w-auto px-8 py-3.5 text-sm gap-2"
              >
                <Compass className="w-4 h-4 text-slate-900" />
                <span>Solo Deck</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="btn-cobalt w-full sm:w-auto px-8 py-3.5 text-sm gap-2"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="btn-white w-full sm:w-auto px-8 py-3.5 text-sm gap-2"
              >
                <LogIn className="w-4 h-4 text-slate-900" />
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards Grid (Screen 2 / Copy Design horizontal style) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          <div className="card-obsidian p-6 relative overflow-hidden group hover:border-blue-500/40 transition">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Curated Spots Under ₹1000</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified street food alleys, board game cafes, bowling alleys, and cultural spots in your city tailored specifically for student budgets.
            </p>
          </div>

          <div className="card-obsidian p-6 relative overflow-hidden group hover:border-blue-500/40 transition">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Collaborative Group Swiping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create a group with an invite code. All group members swipe independently to eliminate group chat friction.
            </p>
          </div>

          <div className="card-obsidian p-6 relative overflow-hidden group hover:border-blue-500/40 transition">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Consensus & Scheduling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock instant unanimous matches (100% agreed), ranked consensus percentages, and lock down planned dates and times.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>HanginOut © 2026. All rights reserved.</p>
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
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
