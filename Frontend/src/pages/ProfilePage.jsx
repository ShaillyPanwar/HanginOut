import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Calendar, Save, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    city: user?.city || 'Delhi',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      await updateProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        city: formData.city,
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Update error:", err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
              HO
            </div>
            <span className="font-bold text-lg text-white">Hangin<span className="text-orange-500">Out</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              Home
            </Link>
            <button
              onClick={logout}
              className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* User Hero Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-xl shadow-orange-500/10">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user?.email}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 font-mono ml-1">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>

          {/* Feedback Toasts */}
          {successMsg && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Edit Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSave}>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-orange-400" />
              <span>Personal Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-500 cursor-not-allowed text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed directly.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Preferred City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Noida">Noida</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
