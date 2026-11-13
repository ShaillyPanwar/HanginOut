import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { groupService } from '../services/groupService';
import { planService } from '../services/planService';
import {
  ArrowLeft,
  Sparkles,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Trophy,
  Compass,
  PlusCircle,
  Share2,
  Check,
  ChevronRight,
  Loader2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import FeedbackTriggerButton from '../components/feedback/FeedbackTriggerButton';

export default function MatchResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [matches, setMatches] = useState(null);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'plans'
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [planToast, setPlanToast] = useState({ message: '', type: 'success' });
  const [deletePlanConfirmId, setDeletePlanConfirmId] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(false);

  // Scheduling modal state
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [planDate, setPlanDate] = useState('');
  const [planTime, setPlanTime] = useState('18:00');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#10b981', '#38bdf8', '#a855f7']
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupRes, matchRes, planRes] = await Promise.all([
        groupService.getGroupById(id),
        groupService.getGroupMatches(id),
        planService.getGroupPlans(id)
      ]);

      setGroup(groupRes.data);
      setMatches(matchRes.data);
      setPlans(planRes.data || []);

      // If there are unanimous matches, fire confetti once on entry
      if (matchRes.data?.unanimousMatches?.length > 0) {
        triggerConfetti();
      }
    } catch (err) {
      console.error('Failed to load group match details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCopyCode = () => {
    if (!group?.inviteCode) return;
    navigator.clipboard.writeText(group.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenScheduleModal = (activity) => {
    setSelectedActivity(activity);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPlanDate(tomorrow.toISOString().split('T')[0]);
    setPlanTime('18:00');
    setScheduleError('');
    setScheduleSuccess('');
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!selectedActivity || !planDate || !planTime) return;

    setScheduling(true);
    setScheduleError('');
    try {
      const spotId = selectedActivity.spot ? selectedActivity.spot.id : null;
      const res = await planService.createPlan(id, {
        activityId: selectedActivity.id,
        spotId: spotId,
        plannedDate: planDate,
        plannedTime: planTime.length === 5 ? `${planTime}:00` : planTime
      });

      setScheduleSuccess('Hangout successfully scheduled!');
      setPlans((prev) => [res.data, ...prev]);

      setTimeout(() => {
        setSelectedActivity(null);
        setActiveTab('plans');
      }, 1200);
    } catch (err) {
      setScheduleError(err.response?.data?.message || 'Failed to schedule hangout.');
    } finally {
      setScheduling(false);
    }
  };

  const handleUpdatePlanStatus = async (planId, status) => {
    try {
      const res = await planService.updatePlan(planId, { status });
      setPlans((prev) => prev.map((p) => (p.id === planId ? res.data : p)));
    } catch (err) {
      console.error('Failed to update plan status:', err);
    }
  };

  const handleDeletePlan = (planId) => {
    setDeletePlanConfirmId(planId);
  };

  const executeDeletePlan = async () => {
    if (!deletePlanConfirmId) return;
    setDeletingPlan(true);
    try {
      await planService.deletePlan(deletePlanConfirmId);
      setPlans((prev) => prev.filter((p) => p.id !== deletePlanConfirmId));
      setPlanToast({ message: 'Hangout plan deleted successfully!', type: 'success' });
      setTimeout(() => setPlanToast({ message: '', type: 'success' }), 3000);
      setDeletePlanConfirmId(null);
    } catch (err) {
      console.error('Failed to delete plan:', err);
      setPlanToast({
        message: err.response?.data?.message || 'Failed to delete hangout plan',
        type: 'error'
      });
      setTimeout(() => setPlanToast({ message: '', type: 'error' }), 4000);
    } finally {
      setDeletingPlan(false);
    }
  };

  // Helper date formatter
  const todayStr = new Date().toISOString().split('T')[0];

  const formatPlanDate = (dateStr, timeStr) => {
    try {
      const date = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return `${dateStr} at ${timeStr}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090E] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2B59FF] animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Aggregating group consensus...</p>
        </div>
      </div>
    );
  }

  const unanimousList = matches?.unanimousMatches || [];
  const consensusList = matches?.consensusMatches || [];
  const totalMembers = group?.membersCount || matches?.totalMembers || 1;

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient Cobalt Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-radial from-blue-600/20 via-blue-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0B0C12]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/groups"
              className="p-2.5 rounded-full bg-[#131625] hover:bg-[#1a1e33] border border-blue-500/20 text-slate-300 hover:text-white transition"
              title="Back to Groups"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-white line-clamp-1">{group?.name}</h1>
                <span className="text-xs bg-[#131625] text-slate-300 px-2.5 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1 font-semibold">
                  <Users className="w-3 h-3 text-blue-400" />
                  <span>{totalMembers}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Code:</span>
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <span>{group?.inviteCode}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/groups/${id}/swipe`}
              className="btn-cobalt text-xs font-bold px-4 py-2 rounded-full text-white shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Swipe Deck</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* Tab Headers (Screen 3 style) */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'matches'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-[#131625] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Consensus Results</span>
              {unanimousList.length > 0 && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {unanimousList.length} 100%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'plans'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-[#131625] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Scheduled Hangouts</span>
              {plans.length > 0 && (
                <span className="bg-[#1c2138] text-slate-300 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                  {plans.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'matches' && unanimousList.length > 0 && (
            <button
              onClick={triggerConfetti}
              className="hidden sm:flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full transition font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate Matches</span>
            </button>
          )}
        </div>

        {/* TAB 1: MATCHES & CONSENSUS */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            {/* Unanimous Matches Section */}
            {unanimousList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Unanimous Matches (100% Agreement)</h2>
                    <p className="text-xs text-slate-400">Every group member swiped RIGHT on these hangout spots!</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unanimousList.map((match) => {
                    const act = match.activity;
                    return (
                      <div
                        key={act.id}
                        className="relative rounded-3xl overflow-hidden border-2 border-blue-500/40 bg-[#111422] shadow-2xl shadow-blue-500/10 flex flex-col"
                      >
                        {/* 100% Badge */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 btn-cobalt text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>100% MATCH</span>
                        </div>

                        {/* Image Banner */}
                        <div className="h-44 w-full bg-[#08090E] relative">
                          <img
                            src={act.coverImageUrl || act.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                            alt={act.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111422] via-transparent to-black/30" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <div>
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/90 text-white uppercase tracking-wider">
                                {act.categoryName || 'Activity'}
                              </span>
                              <h3 className="text-lg font-bold text-white mt-1 drop-shadow-md">{act.title}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-300 block">Per person</span>
                              <span className="text-base font-extrabold text-cyan-400">
                                ₹{act.estimatedCostPerPerson ?? act.price ?? 'Free'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            {act.spot && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                <span className="line-clamp-1">{act.spot.name} • {act.spot.neighborhood || act.spot.city}</span>
                              </div>
                            )}
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                              {act.description}
                            </p>

                            {/* Member Votes Roster */}
                            <div className="bg-[#08090E] rounded-2xl p-3 border border-slate-800 mb-4">
                              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                                Group Votes ({match.likesCount}/{match.totalMembers}):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {match.memberVotes?.map((vote) => (
                                  <span
                                    key={vote.userId}
                                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                    <span>{vote.userName}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Feedback & Schedule */}
                          <div className="space-y-2.5 mt-2">
                            <FeedbackTriggerButton
                              activity={act}
                              groupId={id}
                              variant="matched-card"
                            />
                            <button
                              onClick={() => handleOpenScheduleModal(act)}
                              className="btn-cobalt w-full py-3 rounded-full font-bold text-white shadow-lg shadow-blue-500/35 text-sm flex items-center justify-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>Schedule Hangout</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consensus Matches Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Consensus Rankings</h2>
                    <p className="text-xs text-slate-400">Activities ranked by group agreement percentage</p>
                  </div>
                </div>
              </div>

              {consensusList.length === 0 && unanimousList.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-blue-500/20 p-12 text-center bg-[#0B0C12]/50">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">No Matches Recorded Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                    Invite group members to join with code <span className="text-blue-400 font-mono font-bold">{group?.inviteCode}</span> and start swiping to discover agreed spots!
                  </p>
                  <Link
                    to={`/groups/${id}/swipe`}
                    className="btn-cobalt inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md shadow-blue-500/30"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Start Swiping Now</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consensusList.map((match) => {
                    const act = match.activity;
                    const percent = Math.round(match.matchPercentage);
                    return (
                      <div
                        key={act.id}
                        className="rounded-3xl border border-blue-500/15 bg-[#111422] p-5 hover:border-blue-500/35 transition flex flex-col justify-between shadow-xl"
                      >
                        <div>
                          {/* Percentage header */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Agreement</span>
                            <span
                              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                percent >= 66
                                  ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {percent}% Agreed ({match.likesCount}/{match.totalMembers})
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-[#08090E] h-2.5 rounded-full overflow-hidden mb-4 border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percent >= 66 ? 'bg-gradient-to-r from-[#2B59FF] to-cyan-400 shadow-glow-blue' : 'bg-gradient-to-r from-amber-500 to-orange-400'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          {/* Activity Title & Spot */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-white text-base leading-snug">{act.title}</h3>
                              {act.spot && (
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-blue-400" />
                                  <span>{act.spot.name} • {act.spot.neighborhood || act.spot.city}</span>
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-bold text-cyan-400 whitespace-nowrap">
                              ₹{act.estimatedCostPerPerson ?? act.price ?? 'Free'}
                            </span>
                          </div>

                          {/* Member breakdown */}
                          <div className="flex flex-wrap gap-1.5 my-3">
                            {match.memberVotes?.map((vote) => (
                              <span
                                key={vote.userId}
                                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                                  vote.action === 'LIKE'
                                    ? 'bg-blue-500/10 text-cyan-300 border border-blue-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {vote.action === 'LIKE' ? (
                                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                <span>{vote.userName}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons: Feedback & Schedule */}
                        <div className="space-y-2 mt-3">
                          <FeedbackTriggerButton
                            activity={act}
                            groupId={id}
                            variant="matched-card"
                          />
                          <button
                            onClick={() => handleOpenScheduleModal(act)}
                            className="btn-white w-full py-2.5 rounded-full font-bold text-xs text-slate-950 shadow-md transition flex items-center justify-center gap-1.5"
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-950" />
                            <span>Schedule Hangout</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULED HANGOUT PLANS */}
        {activeTab === 'plans' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white">Group Hangout Itinerary</h2>
                <p className="text-xs text-slate-400">Scheduled events agreed upon by the group</p>
              </div>
            </div>

            {plans.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-blue-500/20 p-12 text-center bg-[#0B0C12]/50">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Hangouts Scheduled Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Pick an agreed activity from the Consensus Results tab and schedule a date/time for the group!
                </p>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="btn-cobalt text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md shadow-blue-500/30"
                >
                  View Agreed Activities
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => {
                  const isCompleted = plan.status === 'COMPLETED';
                  const isCancelled = plan.status === 'CANCELLED';

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-3xl border p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-emerald-950/15'
                          : isCancelled
                          ? 'border-slate-800 bg-[#0B0C12]/40 opacity-60'
                          : 'border-blue-500/20 bg-[#111422] hover:border-blue-500/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isCancelled
                              ? 'bg-slate-800 text-slate-500'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          <Calendar className="w-5 h-5 mb-0.5" />
                          <span className="text-[10px] uppercase font-mono">
                            {plan.plannedDate ? plan.plannedDate.split('-')[2] : 'Plan'}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isCancelled
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {plan.status}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{formatPlanDate(plan.plannedDate, plan.plannedTime)}</span>
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white line-clamp-1">
                            {plan.activity?.title || 'Group Hangout'}
                          </h3>

                          {plan.spot && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                              <span>{plan.spot.name} • {plan.spot.address || plan.spot.city}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Plan Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!isCompleted && !isCancelled && (
                          <button
                            onClick={() => handleUpdatePlanStatus(plan.id, 'COMPLETED')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1"
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>
                        )}

                        {!isCancelled && (
                          <button
                            onClick={() => handleUpdatePlanStatus(plan.id, 'CANCELLED')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#131625] hover:bg-[#1a1e33] text-slate-300 border border-slate-800 transition"
                            title="Cancel hangout"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* SCHEDULING MODAL */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0C12] border border-blue-500/20 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-1">Schedule Hangout</h2>
            <p className="text-xs text-slate-400 mb-4">
              Coordinate date and time for <span className="text-blue-400 font-semibold">{selectedActivity.title}</span>
            </p>

            {scheduleError && (
              <div className="p-3 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{scheduleError}</span>
              </div>
            )}

            {scheduleSuccess && (
              <div className="p-3 mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{scheduleSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="w-full bg-[#08090E] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={planTime}
                  onChange={(e) => setPlanTime(e.target.value)}
                  className="w-full bg-[#08090E] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>

              {selectedActivity.spot && (
                <div className="p-3.5 rounded-2xl bg-[#08090E] border border-slate-800/80 text-xs">
                  <span className="text-slate-400 block mb-0.5">Location</span>
                  <span className="font-semibold text-white">{selectedActivity.spot.name}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {selectedActivity.spot.address || selectedActivity.spot.city}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  disabled={scheduling}
                  className="btn-white px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="btn-cobalt px-6 py-2.5 rounded-full text-xs font-extrabold text-white transition shadow-md shadow-blue-500/30 flex items-center gap-1.5"
                >
                  {scheduling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Plan Confirmation Modal */}
      {deletePlanConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0C12] border border-blue-500/20 rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">Delete Hangout Plan?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to delete this scheduled hangout plan? This will remove the itinerary for all group members and cannot be undone.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeletePlanConfirmId(null)}
                disabled={deletingPlan}
                className="btn-white flex-1 py-2.5 rounded-full text-xs font-bold text-slate-950 transition"
              >
                Keep Plan
              </button>
              <button
                type="button"
                onClick={executeDeletePlan}
                disabled={deletingPlan}
                className="flex-1 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deletingPlan && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {planToast.message && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border ${
          planToast.type === 'error'
            ? 'bg-rose-950/90 border-rose-800 text-rose-200'
            : 'bg-slate-900/90 border-slate-700 text-white'
        }`}>
          {planToast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{planToast.message}</span>
        </div>
      )}
    </div>
  );
}
