import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { Sparkles, Users, Compass, Heart, ArrowRight, ShieldCheck, CheckCircle2, User, LogIn } from 'lucide-react';

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
                Phase 2 Live
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
              <Link
                to="/profile"
                className="text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-semibold"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user?.name || 'My Profile'}</span>
              </Link>
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
          Tired of endless group chat debates? Discover budget-friendly activities in your city, swipe right with your friends, and unlock instant unanimous matches.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>Go to My Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-14 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Hinge-Style Swipe Discovery</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Clean visual cards with expandable bottom drawers revealing student budget estimates, travel times, and full photo galleries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Group Consensus Swipes</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create a group session with an invite code. Every member swipes on their own phone—the algorithm finds places everyone loves.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Hangout Plans</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unanimous matches trigger celebratory confetti and convert directly into date/time scheduled plans with linked spot details.
            </p>
          </div>
        </div>

        {/* Phase Verification Status */}
        <div className="w-full mt-14 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800/80 text-left">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Engineering Deliverables (Phase 1 & 2 Completed)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Stateless JWT Authentication & BCrypt 12 Security</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>POST /api/auth/register & POST /api/auth/login</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>GET /api/users/me & PUT /api/users/me (IDOR-safe)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Standard Error Handling: 400, 401, 403, 404, 409, 500</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Flyway V1 Schema: 16 relational tables with constraints</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>9/9 Automated Backend Integration Tests Passing</span>
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
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
