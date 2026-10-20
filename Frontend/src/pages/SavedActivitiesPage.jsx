import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedService } from '../services/savedService';
import { Bookmark, Trash2, ArrowLeft, Clock, MapPin, IndianRupee, Sparkles, Loader2, Compass } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/discover"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-extrabold text-lg text-white">My Saved Hangouts</h1>
          </div>

          <Link
            to="/discover"
            className="text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 px-3.5 py-1.5 rounded-xl hover:from-orange-600 hover:to-amber-500 transition shadow"
          >
            Discover More
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
            <p className="text-sm">Loading your bookmarked places...</p>
          </div>
        ) : savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedItems.map((item) => {
              const act = item.activity;
              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/30 transition flex flex-col justify-between group"
                >
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={act.coverImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    {act.categoryName && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-orange-400 border border-slate-700/60">
                        {act.categoryName}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base line-clamp-1">{act.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                        <span className="text-emerald-400 font-semibold">
                          {act.minCost === 0 && act.maxCost === 0 ? 'FREE' : `₹${act.minCost} - ₹${act.maxCost}`}
                        </span>
                        <span>•</span>
                        <span>{act.durationMinutes} mins</span>
                        <span>•</span>
                        <span>{act.city}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Saved on {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRemove(act.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded-lg transition"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-3xl max-w-md mx-auto p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Saved Hangouts Yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              When you find a spot you'd like to revisit, tap "Save for later" on the card deck.
            </p>
            <Link
              to="/discover"
              className="py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 inline-flex items-center gap-2 text-sm"
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
