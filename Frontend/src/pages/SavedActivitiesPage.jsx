import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedService } from '../services/savedService';
import { Bookmark, Trash2, ArrowLeft, Clock, MapPin, IndianRupee, Sparkles, Loader2, Compass } from 'lucide-react';
import FeedbackTriggerButton from '../components/feedback/FeedbackTriggerButton';

export default function SavedActivitiesPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await savedService.getSavedActivities({ size: 50 });
      setSavedItems(res.data?.content || []);
    } catch (err) {
      console.error("Failed to load saved activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (activityId) => {
    try {
      await savedService.unsaveActivity(activityId);
      setSavedItems((prev) => prev.filter((item) => item.activity.id !== activityId));
    } catch (err) {
      console.error("Failed to remove saved item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient Cobalt Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-radial from-blue-600/20 via-blue-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0B0C12]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/discover"
              className="p-2.5 rounded-full bg-[#131625] hover:bg-[#1a1e33] border border-blue-500/20 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-extrabold text-lg text-white">My Saved Hangouts</h1>
          </div>

          <Link
            to="/discover"
            className="btn-cobalt text-xs font-bold text-white px-4 py-2 rounded-full shadow-md"
          >
            Discover More
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#2B59FF] mb-3" />
            <p className="text-sm">Loading your bookmarked places...</p>
          </div>
        ) : savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedItems.map((item) => {
              const act = item.activity;
              return (
                <div
                  key={item.id}
                  className="bg-[#111422] border border-blue-500/20 rounded-3xl overflow-hidden shadow-xl hover:border-blue-500/40 transition flex flex-col justify-between group"
                >
                  <div className="relative h-48 bg-[#08090E] overflow-hidden">
                    <img
                      src={act.coverImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111422] via-transparent to-transparent" />
                    {act.categoryName && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0B0C12]/80 backdrop-blur-md text-blue-400 border border-blue-500/30">
                        {act.categoryName}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base line-clamp-1">{act.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                        <span className="text-cyan-400 font-semibold">
                          {act.minCost === 0 && act.maxCost === 0 ? 'FREE' : `₹${act.minCost} - ₹${act.maxCost}`}
                        </span>
                        <span>•</span>
                        <span>{act.durationMinutes} mins</span>
                        <span>•</span>
                        <span>{act.city}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between gap-2">
                        <FeedbackTriggerButton
                          activity={act}
                          variant="saved-card"
                        />
                        <button
                          onClick={() => handleRemove(act.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 p-2 hover:bg-rose-500/10 rounded-full transition border border-transparent hover:border-rose-500/20"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-2">
                        Saved on {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0B0C12] border border-blue-500/20 rounded-3xl max-w-md mx-auto p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Saved Hangouts Yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              When you find a spot you'd like to revisit, tap "Save for later" on the card deck.
            </p>
            <Link
              to="/discover"
              className="btn-cobalt py-3 px-6 rounded-full font-bold text-white shadow-lg shadow-blue-500/35 inline-flex items-center gap-2 text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Activities</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
