import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activityService } from '../services/activityService';
import { swipeService } from '../services/swipeService';
import { savedService } from '../services/savedService';
import ExpandableActivityCard from '../components/cards/ExpandableActivityCard';
import LocationSelectorModal from '../components/location/LocationSelectorModal';
import {
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  RotateCcw,
  Loader2,
  CheckCircle2,
  MapPin,
  Compass,
  Calendar,
  AlertCircle,
  X,
  ChevronDown,
  Navigation,
  Globe2
} from 'lucide-react';

const DISTANCE_OPTIONS = [
  { label: 'Any distance', value: null },
  { label: 'Within 1 km', value: 1 },
  { label: 'Within 3 km', value: 3 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 20 km', value: 20 },
  { label: 'Within 50 km', value: 50 },
];

export default function DiscoverPage() {
  const { user, updateProfile } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackToast, setFeedbackToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Geolocation & Distance Filter states
  const [userLocation, setUserLocation] = useState(() => {
    const saved = sessionStorage.getItem('hanginout_user_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.source !== 'fallback' && parsed.label !== 'Rohini, Delhi') {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      type: 'all',
      label: 'All Delhi NCR',
      zone: null,
      locality: null,
      latitude: null,
      longitude: null,
      source: 'all',
    };
  });

  const [selectedDistance, setSelectedDistance] = useState(null); // default: Any distance
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // DOB completion prompt state
  const [showDobModal, setShowDobModal] = useState(false);
  const [dobInput, setDobInput] = useState('');
  const [dobSaving, setDobSaving] = useState(false);
  const [dobError, setDobError] = useState('');

  // 1. Load Activities with current zone, locality, and optional coordinates/distance filters
  const loadActivities = async () => {
    setLoading(true);
    setErrorToast('');

    // Check if user has missing DOB
    if (user && !user.dateOfBirth) {
      setShowDobModal(true);
    }

    try {
      const params = {
        size: 25,
      };

      if (userLocation.zone) {
        params.zone = userLocation.zone;
      }
      if (userLocation.locality) {
        params.locality = userLocation.locality;
      }
      if (userLocation.latitude != null && userLocation.longitude != null) {
        params.latitude = userLocation.latitude;
        params.longitude = userLocation.longitude;
      }
      if (selectedDistance != null) {
        params.maxDistanceKm = selectedDistance;
      }

      const res = await activityService.getRecommendedActivities(params);
      if (res.data && res.data.length > 0) {
        setActivities(res.data);
      } else {
        if (selectedDistance == null) {
          // Fallback to general activities only if Any distance has 0 unswiped recommendations
          const generalParams = {
            size: 25,
            zone: userLocation.zone || undefined,
            locality: userLocation.locality || undefined,
          };
          const generalRes = await activityService.getActivities(generalParams);
          setActivities(generalRes.data?.content || []);
        } else {
          // Distance filter active: strict empty deck when 0 spots match radius
          setActivities([]);
        }
      }
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load activities:", err);
      const msg = err.response?.data?.message || 'Failed to load recommendations';
      if (msg.toLowerCase().includes('date of birth')) {
        setShowDobModal(true);
      } else {
        setErrorToast(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [userLocation.zone, userLocation.locality, userLocation.latitude, userLocation.longitude, selectedDistance]);

  const handleSwipe = async (activityId, action) => {
    if (swiping) return;
    setSwiping(true);

    try {
      await swipeService.recordSwipe(activityId, action);
      if (action === 'LIKE') {
        setFeedbackToast('Added to Liked Hangouts! ❤️');
      }
      setTimeout(() => setFeedbackToast(''), 2500);

      // Advance deck
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Swipe submission error:", err);
    } finally {
      setSwiping(false);
    }
  };

  const handleBookmarkCurrent = async () => {
    const current = activities[currentIndex];
    if (!current) return;

    try {
      await savedService.saveActivity(current.id);
      setFeedbackToast('Saved to My Hangouts! 📌');
      setTimeout(() => setFeedbackToast(''), 2500);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const handleSaveDob = async (e) => {
    e.preventDefault();
    if (!dobInput) {
      setDobError('Date of birth is required.');
      return;
    }

    const birthDate = new Date(dobInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate >= today) {
      setDobError('Date of birth must be a past date.');
      return;
    }

    setDobSaving(true);
    setDobError('');
    try {
      await updateProfile({ dateOfBirth: dobInput });
      setShowDobModal(false);
      setFeedbackToast('Profile updated! Enjoy personalized discoveries.');
      setTimeout(() => setFeedbackToast(''), 3000);
      loadActivities();
    } catch (err) {
      console.error('Failed to update DOB:', err);
      setDobError(err.response?.data?.message || 'Failed to update Date of Birth');
    } finally {
      setDobSaving(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setUserLocation(loc);
    sessionStorage.setItem('hanginout_user_location', JSON.stringify(loc));
    setShowLocationModal(false);
    setCurrentIndex(0);
    setFeedbackToast(`Showing hangouts in ${loc.label}! 📍`);
    setTimeout(() => setFeedbackToast(''), 2500);
  };

  const handleRequestGpsLocation = () => {
    if (!navigator.geolocation) {
      setErrorToast('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    sessionStorage.removeItem('hanginout_geo_status');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        let label = 'Live GPS Location';
        const dRohiniLat = Math.abs(latitude - 28.7180);
        const dRohiniLon = Math.abs(longitude - 77.1130);
        if (dRohiniLat < 0.08 && dRohiniLon < 0.08) {
          label = 'Live GPS (Rohini)';
        } else if (Math.abs(latitude - 28.6139) < 0.35 && Math.abs(longitude - 77.2090) < 0.35) {
          label = 'Live GPS (Delhi NCR)';
        } else {
          label = `Live GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
        }
        const loc = {
          type: 'gps',
          latitude,
          longitude,
          label,
          zone: null,
          locality: null,
          source: 'gps',
        };
        setUserLocation(loc);
        sessionStorage.setItem('hanginout_geo_status', 'granted');
        sessionStorage.setItem('hanginout_user_location', JSON.stringify(loc));
        setShowLocationModal(false);
        setCurrentIndex(0);
        setFeedbackToast('Live GPS location activated! 📍');
        setTimeout(() => setFeedbackToast(''), 2500);
      },
      (err) => {
        setGpsLoading(false);
        console.warn('Geolocation denied or unavailable:', err);
        sessionStorage.setItem('hanginout_geo_status', 'denied');
        setErrorToast('Location permission denied. Showing All Delhi NCR spots');
        setTimeout(() => setErrorToast(''), 3500);
        setShowLocationModal(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const currentActivity = activities[currentIndex];
  const hasMore = currentIndex < activities.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
              HO
            </div>
            <span className="font-bold text-lg text-white">Hangin<span className="text-orange-500">Out</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition relative"
              title="My Saved Hangouts"
            >
              <Bookmark className="w-5 h-5" />
            </Link>

            <Link
              to="/onboarding"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition flex items-center gap-1.5 font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Preferences</span>
            </Link>
          </div>
        </div>

        {/* Geolocation & Distance Filter Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Detected / Fallback / Manual Location Indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/20 font-medium transition"
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-semibold">{userLocation.label || 'All Delhi NCR'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 font-mono">
                  {userLocation.source === 'gps' ? 'GPS' : userLocation.source === 'all' ? 'All NCR' : userLocation.locality ? 'Locality' : 'Zone'}
                </span>
                <span className="text-slate-400 text-[10px] ml-0.5">(Change)</span>
              </button>
            </div>

            {/* Distance Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1 flex-shrink-0">
                <Compass className="w-3 h-3 text-orange-400" />
                <span>Radius:</span>
              </span>
              {DISTANCE_OPTIONS.map((opt) => {
                const isActive = selectedDistance === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedDistance(opt.value);
                      setCurrentIndex(0);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold shadow-sm shadow-orange-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Discover Area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col justify-center items-center relative">
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="absolute top-2 z-50 px-4 py-2 rounded-full bg-slate-800/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {errorToast && (
          <div className="absolute top-2 z-50 px-4 py-2 rounded-full bg-rose-500/90 border border-rose-400 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-white" />
            <span>{errorToast}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 py-24">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="text-sm font-medium">Scoring and finding spots near {userLocation.label}...</p>
          </div>
        ) : hasMore ? (
          <div className="w-full flex flex-col items-center">
            {/* Quick Bookmark Pill */}
            <div className="w-full max-w-sm sm:max-w-md flex justify-between items-center mb-3 px-2 text-xs text-slate-400">
              <span className="font-mono">Card {currentIndex + 1} of {activities.length}</span>
              <button
                onClick={handleBookmarkCurrent}
                className="hover:text-amber-400 transition flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save for later</span>
              </button>
            </div>

            {/* Interactive Card */}
            <ExpandableActivityCard
              activity={currentActivity}
              onSwipe={handleSwipe}
              isTopCard={true}
            />
          </div>
        ) : (
          /* Empty Deck State */
          <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedDistance ? `No Spots Found Within ${selectedDistance} km` : "You're All Caught Up!"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {selectedDistance
                ? `There are no active hangout activities within ${selectedDistance} km of ${userLocation.label}. Try expanding your distance radius or picking another neighborhood.`
                : `You've swiped through all available recommendations around ${userLocation.label}.`}
            </p>
            <div className="space-y-3">
              {selectedDistance != null && (
                <button
                  onClick={() => {
                    setSelectedDistance(null);
                    setCurrentIndex(0);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>Expand to Any Distance</span>
                </button>
              )}
              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Change Neighborhood Location</span>
              </button>
              <button
                onClick={loadActivities}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-2 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                <span>Refresh Card Deck</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 15 Zones Delhi NCR Location Selector Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={userLocation}
        onSelectLocation={handleSelectLocation}
        onRequestGps={handleRequestGpsLocation}
        gpsLoading={gpsLoading}
      />

      {/* Mandatory Date of Birth Modal (Age & Safety Rule) */}
      {showDobModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Please Enter Your Date of Birth</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              To provide personalized recommendations and ensure safety compliance, please enter your date of birth before continuing.
            </p>

            {dobError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{dobError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDob} className="space-y-4">
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="submit"
                disabled={dobSaving}
                className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {dobSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Date of Birth'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
