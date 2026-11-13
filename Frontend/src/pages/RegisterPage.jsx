import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    city: 'Delhi',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.dateOfBirth) {
      setError('Date of birth is mandatory.');
      return;
    }

    let formattedDob = formData.dateOfBirth.trim();
    // Normalize localized dd-mm-yyyy or dd/mm/yyyy to ISO yyyy-mm-dd if applicable
    if (formattedDob.includes('-')) {
      const parts = formattedDob.split('-');
      if (parts[0].length === 2 && parts[2]?.length === 4) {
        formattedDob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    } else if (formattedDob.includes('/')) {
      const parts = formattedDob.split('/');
      if (parts[0].length === 2 && parts[2]?.length === 4) {
        formattedDob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const birthDate = new Date(formattedDob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(birthDate.getTime())) {
      setError('Please provide a valid date of birth.');
      return;
    }
    if (birthDate >= today) {
      setError('Date of birth must be a past date. You cannot be born today or in the future.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formattedDob,
        city: formData.city,
      });
      navigate('/profile');
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.errors && Object.keys(err.response.data.errors).length > 0) {
        setFieldErrors(err.response.data.errors);
        const detailedMessages = Object.values(err.response.data.errors).join('. ');
        setError(detailedMessages || err.response.data.message || 'Please correct the highlighted fields.');
      } else {
        const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient Cobalt Glow Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-radial from-blue-600/25 via-blue-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2B59FF] to-[#60A5FA] flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            HO
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Hangin<span className="text-[#2B59FF]">Out</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Join HanginOut</h2>
        <p className="mt-2 text-sm text-slate-400">
          Discover places you & your friends actually want to go
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0B0C12] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-blue-500/20 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-3 rounded-2xl bg-[#08090E] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
              {fieldErrors.name && <p className="text-xs text-rose-400 mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="aarav@student.edu"
                className="w-full px-4 py-3 rounded-2xl bg-[#08090E] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
              {fieldErrors.email && <p className="text-xs text-rose-400 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password * (min 6 characters)
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[#08090E] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
              {fieldErrors.password && <p className="text-xs text-rose-400 mt-1">{fieldErrors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#08090E] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
                {fieldErrors.dateOfBirth && <p className="text-xs text-rose-400 mt-1">{fieldErrors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#08090E] border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Rohini, Delhi">Rohini, Delhi</option>
                  <option value="Noida">Noida</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-cobalt w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-bold text-white shadow-lg shadow-blue-500/35 transition-all disabled:opacity-50 text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#2B59FF] hover:text-[#60A5FA] transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
