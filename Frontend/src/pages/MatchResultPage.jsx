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

export default function MatchResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [matches, setMatches] = useState(null);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'plans'
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this hangout plan?')) return;
    try {
      await planService.deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      console.error('Failed to delete plan:', err);
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-slate-400 text-sm">Aggregating squad consensus...</p>
        </div>
      </div>
    );
  }

  const unanimousList = matches?.unanimousMatches || [];
  const consensusList = matches?.consensusMatches || [];
  const totalMembers = group?.membersCount || matches?.totalMembers || 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/groups"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Back to Squads"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-white line-clamp-1">{group?.name}</h1>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                  <Users className="w-3 h-3 text-orange-400" />
                  <span>{totalMembers}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Code:</span>
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1"
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
              className="text-xs bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-orange-500/20 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Swipe Deck</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'matches'
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white'
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
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'plans'
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Scheduled Hangouts</span>
              {plans.length > 0 && (
                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                  {plans.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'matches' && unanimousList.length > 0 && (
            <button
              onClick={triggerConfetti}
              className="hidden sm:flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg transition"
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
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Unanimous Matches (100% Agreement)</h2>
                    <p className="text-xs text-slate-400">Every squad member swiped RIGHT on these hangout spots!</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unanimousList.map((match) => {
                    const act = match.activity;
                    return (
                      <div
                        key={act.id}
                        className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-gradient-to-b from-slate-900 to-slate-900/90 shadow-xl shadow-emerald-500/10 flex flex-col"
                      >
                        {/* 100% Badge */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-emerald-500 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>100% MATCH</span>
                        </div>

                        {/* Image Banner */}
                        <div className="h-44 w-full bg-slate-800 relative">
                          <img
                            src={act.coverImageUrl || act.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                            alt={act.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-500/90 text-slate-950 uppercase tracking-wider">
                                {act.categoryName || 'Activity'}
                              </span>
                              <h3 className="text-lg font-bold text-white mt-1 drop-shadow-md">{act.title}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-300 block">Per person</span>
                              <span className="text-base font-extrabold text-orange-400">
                                ₹{act.estimatedCostPerPerson ?? act.price ?? 'Free'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            {act.spot && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                                <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                                <span className="line-clamp-1">{act.spot.name} • {act.spot.neighborhood || act.spot.city}</span>
                              </div>
                            )}
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                              {act.description}
                            </p>

                            {/* Member Votes Roster */}
                            <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 mb-4">
                              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                                Squad Votes ({match.likesCount}/{match.totalMembers}):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {match.memberVotes?.map((vote) => (
                                  <span
                                    key={vote.userId}
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{vote.userName}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleOpenScheduleModal(act)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule Hangout</span>
                          </button>
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
                    <p className="text-xs text-slate-400">Activities ranked by squad agreement percentage</p>
                  </div>
                </div>
              </div>

              {consensusList.length === 0 && unanimousList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/30">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto mb-4">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">No Matches Recorded Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                    Invite squad members to join with code <span className="text-orange-400 font-mono font-bold">{group?.inviteCode}</span> and start swiping to discover agreed spots!
                  </p>
                  <Link
                    to={`/groups/${id}/swipe`}
                    className="inline-flex items-center gap-2 text-xs bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition"
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
                        className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 transition flex flex-col justify-between"
                      >
                        <div>
                          {/* Percentage header */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Agreement</span>
                            <span
                              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                percent >= 66
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {percent}% Agreed ({match.likesCount}/{match.totalMembers})
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percent >= 66 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
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
                                  <MapPin className="w-3 h-3 text-orange-400" />
                                  <span>{act.spot.name} • {act.spot.neighborhood || act.spot.city}</span>
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-bold text-orange-400 whitespace-nowrap">
                              ₹{act.estimatedCostPerPerson ?? act.price ?? 'Free'}
                            </span>
                          </div>

                          {/* Member breakdown */}
                          <div className="flex flex-wrap gap-1.5 my-3">
                            {match.memberVotes?.map((vote) => (
                              <span
                                key={vote.userId}
                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                                  vote.action === 'LIKE'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {vote.action === 'LIKE' ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                <span>{vote.userName}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Schedule Button */}
                        <button
                          onClick={() => handleOpenScheduleModal(act)}
                          className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>Schedule Hangout</span>
                        </button>
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
                <h2 className="text-lg font-extrabold text-white">Squad Hangout Itinerary</h2>
                <p className="text-xs text-slate-400">Scheduled events agreed upon by the squad</p>
              </div>
            </div>

            {plans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/30">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Hangouts Scheduled Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Pick an agreed activity from the Consensus Results tab and schedule a date/time for the squad!
                </p>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="text-xs bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded-xl transition"
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
                      className={`rounded-2xl border p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-emerald-950/10'
                          : isCancelled
                          ? 'border-slate-800 bg-slate-900/30 opacity-60'
                          : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isCancelled
                              ? 'bg-slate-800 text-slate-500'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
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
                              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isCancelled
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
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
                              <MapPin className="w-3 h-3 text-orange-400 flex-shrink-0" />
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
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1"
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>
                        )}

                        {!isCancelled && (
                          <button
                            onClick={() => handleUpdatePlanStatus(plan.id, 'CANCELLED')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Cancel hangout"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-1">Schedule Hangout</h2>
            <p className="text-xs text-slate-400 mb-4">
              Coordinate date and time for <span className="text-orange-400 font-semibold">{selectedActivity.title}</span>
            </p>

            {scheduleError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{scheduleError}</span>
              </div>
            )}

            {scheduleSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={planTime}
                  onChange={(e) => setPlanTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none"
                />
              </div>

              {selectedActivity.spot && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 block mb-0.5">Location</span>
                  <span className="font-semibold text-white">{selectedActivity.spot.name}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {selectedActivity.spot.address || selectedActivity.spot.city}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  disabled={scheduling}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 transition shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  {scheduling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
