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
      colors: ['#f97316', '#fbbf24', '#34d399', '#38bdf8', '#f43f5e']
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/groups"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-extrabold text-base text-white line-clamp-1">{group?.name || 'Group Swipes'}</h1>
              <span className="text-xs text-orange-400 font-mono">Code: {group?.inviteCode}</span>
            </div>
          </div>

          <Link
            to={`/groups/${id}/matches`}
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Match Results</span>
          </Link>
        </div>
      </header>

      {/* Main Swipe Deck Area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col justify-center items-center relative">
        {toastMessage && (
          <div className="absolute top-2 z-50 px-4 py-2 rounded-full bg-slate-800/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="text-sm font-medium">Loading group swipe session...</p>
          </div>
        ) : hasMore ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-sm sm:max-w-md flex justify-between items-center mb-3 px-2 text-xs text-slate-400">
              <span className="font-mono">Card {currentIndex + 1} of {activities.length}</span>
              <span className="text-orange-400 font-medium">Group Voting Mode</span>
            </div>

            <ExpandableActivityCard
              activity={currentActivity}
              onSwipe={handleGroupSwipe}
              isTopCard={true}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Round Complete!</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              You've swiped on all candidate activities for this group. Check out what your friends voted on!
            </p>
            <div className="space-y-3">
              <Link
                to={`/groups/${id}/matches`}
                className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm block"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Group Matches</span>
              </Link>

              <button
                onClick={loadData}
                className="w-full py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Voting Round</span>
              </button>
            </div>
          </div>
        )}

        {/* UNANIMOUS MATCH MODAL (DRD Section 5.15) */}
        {unanimousMatch && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl shadow-orange-500/20 animate-scale-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest mb-4 shadow">
                🎉 IT'S A MATCH!
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                100% Squad Consensus!
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Every single member in <span className="text-orange-400 font-semibold">{group?.name}</span> swiped right on this activity!
              </p>

              {/* Matched Activity Preview */}
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 mb-6 text-left shadow">
                <img
                  src={unanimousMatch.coverImageUrl}
                  alt={unanimousMatch.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3.5">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{unanimousMatch.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-emerald-400 font-semibold">
                      {unanimousMatch.minCost === 0 ? 'FREE' : `₹${unanimousMatch.minCost} - ₹${unanimousMatch.maxCost}`}
                    </span>
                    <span>•</span>
                    <span>{unanimousMatch.city}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link
                  to={`/groups/${id}/matches`}
                  className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Hangout Plan</span>
                </Link>

                <button
                  onClick={() => setUnanimousMatch(null)}
                  className="w-full py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
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
