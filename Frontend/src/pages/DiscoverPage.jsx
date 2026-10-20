import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { swipeService } from '../services/swipeService';
import { savedService } from '../services/savedService';
import ExpandableActivityCard from '../components/cards/ExpandableActivityCard';
import { Sparkles, SlidersHorizontal, Bookmark, RotateCcw, Heart, Loader2, Compass, CheckCircle2 } from 'lucide-react';

export default function DiscoverPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackToast, setFeedbackToast] = useState('');

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await activityService.getRecommendedActivities({ size: 15 });
      if (res.data && res.data.length > 0) {
        setActivities(res.data);
      } else {
        // Fallback to general activities if all recommended swiped
        const generalRes = await activityService.getActivities({ size: 15 });
        setActivities(generalRes.data?.content || []);
      }
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleSwipe = async (activityId, action) => {
    if (swiping) return;
    setSwiping(true);

    try {
      await swipeService.recordSwipe(activityId, action);
      if (action === 'LIKE') {
        setFeedbackToast('Added to Liked Hangouts! ❤️');
      }
      setTimeout(() => setFeedbackToast(''), 2500);

      // Advance deck
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Swipe submission error:", err);
    } finally {
      setSwiping(false);
    }
  };

  const handleBookmarkCurrent = async () => {
    const current = activities[currentIndex];
    if (!current) return;

    try {
      await savedService.saveActivity(current.id);
      setFeedbackToast('Saved to My Hangouts! 📌');
      setTimeout(() => setFeedbackToast(''), 2500);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const currentActivity = activities[currentIndex];
  const hasMore = currentIndex < activities.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
              HO
            </div>
            <span className="font-bold text-lg text-white">Hangin<span className="text-orange-500">Out</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition relative"
              title="My Saved Hangouts"
            >
              <Bookmark className="w-5 h-5" />
            </Link>

            <Link
              to="/onboarding"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition flex items-center gap-1.5 font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Preferences</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Discover Area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col justify-center items-center relative">
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="absolute top-2 z-50 px-4 py-2 rounded-full bg-slate-800/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 py-24">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="text-sm font-medium">Scoring and shuffling hangout cards...</p>
          </div>
        ) : hasMore ? (
          <div className="w-full flex flex-col items-center">
            {/* Quick Bookmark Pill */}
            <div className="w-full max-w-sm sm:max-w-md flex justify-between items-center mb-3 px-2 text-xs text-slate-400">
              <span className="font-mono">Card {currentIndex + 1} of {activities.length}</span>
              <button
                onClick={handleBookmarkCurrent}
                className="hover:text-amber-400 transition flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save for later</span>
              </button>
            </div>

            {/* Interactive Card */}
            <ExpandableActivityCard
              activity={currentActivity}
              onSwipe={handleSwipe}
              isTopCard={true}
            />
          </div>
        ) : (
          /* Empty Deck State */
          <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're All Caught Up!</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              You've swiped through all available recommendations for your current preferences.
            </p>
            <div className="space-y-3">
              <button
                onClick={loadActivities}
                className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refresh Card Deck</span>
              </button>
              <Link
                to="/saved"
                className="w-full py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-2 text-sm block"
              >
                <Bookmark className="w-4 h-4 text-orange-400" />
                <span>View Saved Hangouts</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
