import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Star, Edit3, Check } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import ActivityFeedbackModal from './ActivityFeedbackModal';

export default function FeedbackTriggerButton({
  activity,
  variant = 'saved-card', // 'expanded-card' | 'saved-card' | 'matched-card'
  groupId = null,
  onFeedbackChange = null,
  className = '',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myFeedback, setMyFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMyFeedback = async () => {
    if (!activity?.id) return;
    try {
      setLoading(true);
      const res = await feedbackService.getMyFeedback(activity.id);
      setMyFeedback(res.data || null);
    } catch (err) {
      // Non-critical, user might not have reviewed
      console.debug('Failed to fetch user feedback for activity:', activity.id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, [activity?.id]);

  const handleSuccess = (updatedData) => {
    setMyFeedback(updatedData);
    if (onFeedbackChange) {
      onFeedbackChange(updatedData);
    }
  };

  const hasFeedback = Boolean(myFeedback && myFeedback.rating);

  // Variant 1: Expanded Card in Discovery Feed
  if (variant === 'expanded-card') {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`w-full py-2.5 px-4 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 transition group ${
            hasFeedback
              ? 'border-orange-500/50 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20'
              : 'border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-slate-800'
          } ${className}`}
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
          <span>
            {hasFeedback
              ? `Already visited? Edit feedback (${myFeedback.rating}★)`
              : 'Already visited? Add feedback'}
          </span>
        </button>

        <ActivityFeedbackModal
          activity={activity}
          groupId={groupId}
          isOpen={isModalOpen}
          existingFeedback={myFeedback}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  // Variant 2: Saved Activities Card
  if (variant === 'saved-card') {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
            hasFeedback
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-orange-500/40'
          } ${className}`}
        >
          {hasFeedback ? (
            <>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{myFeedback.rating}★ Edit feedback</span>
            </>
          ) : (
            <>
              <MessageSquarePlus className="w-3.5 h-3.5 text-orange-400" />
              <span>Add feedback</span>
            </>
          )}
        </button>

        <ActivityFeedbackModal
          activity={activity}
          groupId={groupId}
          isOpen={isModalOpen}
          existingFeedback={myFeedback}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  // Variant 3: Matched Activities Card (Group Match Result)
  if (variant === 'matched-card') {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
            hasFeedback
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-orange-500/40'
          } ${className}`}
        >
          {hasFeedback ? (
            <>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{myFeedback.rating}★ Edit my feedback</span>
            </>
          ) : (
            <>
              <MessageSquarePlus className="w-3.5 h-3.5 text-orange-400" />
              <span>Add feedback</span>
            </>
          )}
        </button>

        <ActivityFeedbackModal
          activity={activity}
          groupId={groupId}
          isOpen={isModalOpen}
          existingFeedback={myFeedback}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  // Default fallback badge / button
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border border-slate-700 bg-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-white transition ${className}`}
      >
        <Star className="w-3.5 h-3.5 text-orange-400" />
        <span>{hasFeedback ? `Edit Feedback (${myFeedback.rating}★)` : 'Add Feedback'}</span>
      </button>

      <ActivityFeedbackModal
        activity={activity}
        groupId={groupId}
        isOpen={isModalOpen}
        existingFeedback={myFeedback}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
