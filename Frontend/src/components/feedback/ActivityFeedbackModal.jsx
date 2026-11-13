import React, { useState, useEffect } from 'react';
import { Star, X, Calendar, MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';

const RATING_LABELS = {
  1: '1 — Poor',
  2: '2 — Fair',
  3: '3 — Good',
  4: '4 — Very good',
  5: '5 — Excellent',
};

export default function ActivityFeedbackModal({
  activity,
  isOpen,
  onClose,
  onSuccess,
  existingFeedback = null,
  groupId = null,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [feedbackId, setFeedbackId] = useState(null);

  // Maximum date allowed is today
  const todayIso = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen || !activity?.id) return;

    setErrorMsg('');
    setSuccessMsg('');

    // Pre-populate if passed or fetch user's existing review
    if (existingFeedback) {
      setRating(existingFeedback.rating || 0);
      setComment(existingFeedback.comment || '');
      setVisitDate(existingFeedback.visitDate || '');
      setFeedbackId(existingFeedback.id || null);
    } else {
      let isMounted = true;
      setFetchingExisting(true);
      feedbackService.getMyFeedback(activity.id)
        .then((res) => {
          if (!isMounted) return;
          if (res.data) {
            setRating(res.data.rating || 0);
            setComment(res.data.comment || '');
            setVisitDate(res.data.visitDate || '');
            setFeedbackId(res.data.id || null);
          } else {
            setRating(0);
            setComment('');
            setVisitDate('');
            setFeedbackId(null);
          }
        })
        .catch((err) => {
          console.error("Failed to check existing feedback:", err);
        })
        .finally(() => {
          if (isMounted) setFetchingExisting(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, activity?.id, existingFeedback]);

  if (!isOpen || !activity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!rating || rating < 1 || rating > 5) {
      setErrorMsg('Please select a star rating from 1 to 5.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        rating,
        comment: comment.trim() || null,
        visitDate: visitDate || null,
        groupId: groupId || null,
        enjoyed: rating >= 3,
      };

      const res = await feedbackService.submitActivityFeedback(activity.id, payload);
      const savedData = res.data;

      setSuccessMsg(feedbackId ? 'Feedback updated successfully!' : 'Thank you! Your feedback has been submitted.');
      setFeedbackId(savedData?.id || feedbackId);

      if (onSuccess) {
        onSuccess(savedData);
      }

      // Automatically close after a short delay so the user sees the success confirmation
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      const msg = err.response?.data?.message || 'Could not submit feedback. Please check your inputs and try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#0B0C12] border border-blue-500/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{feedbackId ? 'Edit Your Review' : 'Rate Your Hangout'}</span>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {activity.title}
            </h3>
            <p className="text-xs text-slate-400">
              {feedbackId ? 'Update your ratings and visit notes below' : 'Share your real experience with fellow students'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full bg-[#131625] text-slate-400 hover:text-white hover:bg-[#1a1e33] border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {fetchingExisting ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-[#2B59FF] mb-2" />
            <p className="text-xs font-medium">Checking your review history...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            {/* Feedback Error / Success Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1. Rating (Stars) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Your Experience <span className="text-blue-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentDisplayRating;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-700 hover:text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-semibold text-blue-400 mt-2 min-h-[18px]">
                {currentDisplayRating > 0 ? RATING_LABELS[currentDisplayRating] : (
                  <span className="text-slate-500 font-normal">Tap a star to rate from 1 to 5</span>
                )}
              </div>
            </div>

            {/* 2. Written Review (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Your Feedback <span className="text-slate-500 text-[11px] font-normal lowercase">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="What did you think of the vibe, prices, crowding, or highlights? Any tips for other students?"
                className="w-full px-4 py-3 rounded-2xl bg-[#08090E] border border-slate-800 text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              />
              <div className="flex justify-end text-[10px] text-slate-500 mt-1">
                <span>{comment.length}/1000 characters</span>
              </div>
            </div>

            {/* 3. Visit Date (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>When did you visit?</span>
                <span className="text-slate-500 text-[11px] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="date"
                max={todayIso}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#08090E] border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-white px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-cobalt px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-lg shadow-blue-500/35 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>{feedbackId ? 'Update Feedback' : 'Submit Feedback'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
