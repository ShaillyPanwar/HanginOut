import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { Users, Plus, UserPlus, Copy, Check, ArrowRight, Sparkles, Heart, Clock, Loader2, X } from 'lucide-react';

export default function GroupDashboardPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState('');

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await groupService.getUserGroups();
      setGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load user groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setModalLoading(true);
    setModalError('');
    try {
      const res = await groupService.createGroup(groupName);
      setGroups((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      setGroupName('');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setModalLoading(true);
    setModalError('');
    try {
      await groupService.joinGroup(joinCode.trim().toUpperCase());
      await fetchGroups();
      setShowJoinModal(false);
      setJoinCode('');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Invalid or closed group code');
    } finally {
      setModalLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
              HO
            </div>
            <span className="font-bold text-lg text-white">Hangin<span className="text-orange-500">Out</span></span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setModalError(''); setShowJoinModal(true); }}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4 text-orange-400" />
              <span>Join with Code</span>
            </button>

            <button
              onClick={() => { setModalError(''); setShowCreateModal(true); }}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 hover:from-orange-600 hover:to-amber-500 transition shadow shadow-orange-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Squad</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Hangout Squads</h1>
            <p className="text-sm text-slate-400 mt-1">
              Collaborative swiping sessions where everyone votes and unanimous matches win.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
            <p className="text-sm font-medium">Loading your squads...</p>
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-orange-500/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white">{group.name}</h3>
                      <span className="text-xs text-slate-400">Created by {group.creatorName}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {group.status}
                    </span>
                  </div>

                  {/* Invite Code Box */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Invite Code</span>
                      <span className="font-mono font-extrabold text-base text-orange-400">{group.inviteCode}</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(group.inviteCode)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                    >
                      {copiedCode === group.inviteCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Members Stack */}
                  <div className="mb-6">
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      Members ({group.membersCount || group.members?.length || 1})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.members?.map((m) => (
                        <div
                          key={m.userId}
                          className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5"
                        >
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <span>{m.name}</span>
                          {m.isCreator && <span className="text-[10px] text-orange-400 font-bold">(Host)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Squad Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <Link
                    to={`/groups/${group.id}/swipe`}
                    className="py-2.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow text-xs flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 fill-slate-950" />
                    <span>Swipe Deck</span>
                  </Link>

                  <Link
                    to={`/groups/${group.id}/matches`}
                    className="py-2.5 px-4 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition text-xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>View Matches</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Squads Yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Create a group and share the 7-character invite code with your friends to start collaborative swiping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setModalError(''); setShowCreateModal(true); }}
                className="py-3 px-5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Squad</span>
              </button>
              <button
                onClick={() => { setModalError(''); setShowJoinModal(true); }}
                className="py-3 px-5 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition text-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-orange-400" />
                <span>Join with Code</span>
              </button>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Create Hangout Squad</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Weekend Foodies, Delhi Explorers"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {modalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create & Generate Code</span>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Join Friend's Squad</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HNG4821"
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono uppercase tracking-wider text-center"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {modalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Join Squad</span>}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
