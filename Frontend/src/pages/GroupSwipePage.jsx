import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { groupService } from '../services/groupService';
import { activityService } from '../services/activityService';
import ExpandableActivityCard from '../components/cards/ExpandableActivityCard';
import { ArrowLeft, Sparkles, Users, Heart, X, Calendar, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';

export default function GroupSwipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  // Unanimous match celebratory modal
  const [unanimousMatch, setUnanimousMatch] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupRes, actRes] = await Promise.all([
        groupService.getGroupById(id),
        activityService.getActivities({ size: 20 }),
      ]);
      setGroup(groupRes.data);
      setActivities(actRes.data?.content || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load group session:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2b59ff', '#38bdf8', '#ffffff', '#60a5fa', '#34d399']
    });
  };

  const handleGroupSwipe = async (activityId, action) => {
    if (swiping) return;
    setSwiping(true);

    try {
      await groupService.recordGroupSwipe(id, activityId, action);

      // Check if this swipe triggered a unanimous match
      const matchRes = await groupService.getGroupMatches(id);
      const matched = matchRes.data?.unanimousMatches?.find(m => m.activity.id === activityId);

      if (matched && action === 'LIKE') {
        // Trigger celebratory confetti and modal
        triggerConfetti();
        setUnanimousMatch(matched.activity);
      } else if (action === 'LIKE') {
        setToastMessage('Voted YES! Waiting for friends to swipe 🗳️');
        setTimeout(() => setToastMessage(''), 2500);
      }

      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error("Group swipe error:", err);
    } finally {
      setSwiping(false);
    }
  };

  const currentActivity = activities[currentIndex];
  const hasMore = currentIndex < activities.length;

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient Cobalt Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-radial from-blue-600/20 via-blue-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0C12]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/groups"
              className="p-2.5 rounded-full bg-[#131625] hover:bg-[#1a1e33] border border-blue-500/20 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-extrabold text-base text-white line-clamp-1">{group?.name || 'Group Swipes'}</h1>
              <span className="text-[11px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Code: {group?.inviteCode}
              </span>
            </div>
          </div>

          <Link
            to={`/groups/${id}/matches`}
            className="btn-white text-xs font-bold px-4 py-2 rounded-full text-slate-950 shadow-md transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Match Results</span>
          </Link>
        </div>
      </header>

      {/* Main Swipe Deck Area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col justify-center items-center relative">
        {toastMessage && (
          <div className="absolute top-2 z-50 px-4 py-2 rounded-full bg-[#131625]/95 border border-blue-500/30 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#2B59FF] mb-4" />
            <p className="text-sm font-medium">Loading group swipe session...</p>
          </div>
        ) : hasMore ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-sm sm:max-w-md flex justify-between items-center mb-3 px-2 text-xs text-slate-400">
              <span className="font-mono text-slate-400">Card {currentIndex + 1} of {activities.length}</span>
              <span className="text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 text-[11px]">
                Group Voting Mode
              </span>
            </div>

            <ExpandableActivityCard
              activity={currentActivity}
              onSwipe={handleGroupSwipe}
              isTopCard={true}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-[#111422] border border-blue-500/20 rounded-3xl max-w-sm sm:max-w-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Round Complete!</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              You've swiped on all candidate activities for this group. Check out what your friends voted on!
            </p>
            <div className="space-y-3">
              <Link
                to={`/groups/${id}/matches`}
                className="btn-cobalt w-full py-3.5 px-4 rounded-full font-bold text-white shadow-lg shadow-blue-500/35 flex items-center justify-center gap-2 text-sm block"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Group Matches</span>
              </Link>

              <button
                onClick={loadData}
                className="btn-white w-full py-3 px-4 rounded-full font-bold text-slate-950 shadow-md transition flex items-center justify-center gap-2 text-xs"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" />
                <span>Restart Voting Round</span>
              </button>
            </div>
          </div>
        )}

        {/* UNANIMOUS MATCH MODAL */}
        {unanimousMatch && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0B0C12] border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl shadow-blue-500/30 animate-scale-up">
              <div className="btn-cobalt inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white font-black text-xs uppercase tracking-widest mb-4 shadow">
                🎉 IT'S A MATCH!
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                100% Group Consensus!
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Every single member in <span className="text-blue-400 font-semibold">{group?.name}</span> swiped right on this activity!
              </p>

              {/* Matched Activity Preview */}
              <div className="rounded-2xl overflow-hidden bg-[#111422] border border-blue-500/20 mb-6 text-left shadow">
                <img
                  src={unanimousMatch.coverImageUrl}
                  alt={unanimousMatch.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3.5">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{unanimousMatch.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-cyan-400 font-semibold">
                      {unanimousMatch.minCost === 0 ? 'FREE' : `₹${unanimousMatch.minCost} - ₹${unanimousMatch.maxCost}`}
                    </span>
                    <span>•</span>
                    <span>{unanimousMatch.city}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Screen 3 style dual action buttons) */}
              <div className="space-y-2.5">
                <Link
                  to={`/groups/${id}/matches`}
                  className="btn-cobalt w-full py-3.5 px-4 rounded-full font-bold text-white shadow-lg shadow-blue-500/35 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Hangout Plan</span>
                </Link>

                <button
                  onClick={() => setUnanimousMatch(null)}
                  className="btn-white w-full py-3 rounded-full font-bold text-slate-950 shadow-md transition text-xs"
                >
                  Keep Swiping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
