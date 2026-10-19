import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
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

    setSubmitting(true);
    try {
      await register({
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null,
      });
      navigate('/profile');
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            HO
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">Hangin<span className="text-orange-500">Out</span></span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Join HanginOut</h2>
        <p className="mt-2 text-sm text-slate-400">
          Discover places you & your friends actually want to go
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              {fieldErrors.name && <p className="text-xs text-rose-400 mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="aarav@student.edu"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              {fieldErrors.email && <p className="text-xs text-rose-400 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password * (min 6 characters)
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              {fieldErrors.password && <p className="text-xs text-rose-400 mt-1">{fieldErrors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  City
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
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

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
