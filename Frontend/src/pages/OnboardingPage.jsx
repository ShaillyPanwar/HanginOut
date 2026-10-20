import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preferenceService } from '../services/preferenceService';
import { activityService } from '../services/activityService';
import { Sparkles, ArrowRight, ArrowLeft, Check, IndianRupee, Clock, Users, Compass, Loader2 } from 'lucide-react';

const BUDGET_OPTIONS = [
  { label: 'Free', sub: '₹0 budget hangouts', value: 'Free' },
  { label: 'Under ₹100', sub: 'Chai, snacks & park strolls', value: 'Under ₹100' },
  { label: 'Under ₹300', sub: 'Street food & museum tickets', value: 'Under ₹300' },
  { label: 'Under ₹500', sub: 'Cafes & bowling sessions', value: 'Under ₹500' },
  { label: '₹500+', sub: 'Go-karting & weekend splurges', value: '₹500+' },
];

const DURATION_OPTIONS = [
  { label: '< 1 hour', value: '<1 hour', icon: '⚡' },
  { label: '1 - 2 hours', value: '1-2 hours', icon: '⏱️' },
  { label: '2 - 4 hours', value: '2-4 hours', icon: '🌇' },
  { label: '4+ hours (Half-day)', value: '4+ hours', icon: '🚀' },
];

const GROUP_OPTIONS = [
  { label: 'With Friends', value: 'Friends', sub: 'Group activities & games' },
  { label: 'Solo Wanderer', value: 'Solo', sub: 'Peaceful reading & nature' },
  { label: 'Any / Both', value: 'Any', sub: 'Flexible for everything' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);

  const [maxBudget, setMaxBudget] = useState('Under ₹300');
  const [preferredDuration, setPreferredDuration] = useState('1-2 hours');
  const [preferredGroupType, setPreferredGroupType] = useState('Friends');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [city, setCity] = useState('Delhi');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await activityService.getCategories();
        if (res.data) {
          setCategories(res.data);
          // Default select first 3 categories
          const initial = new Set(res.data.slice(0, 3).map(c => c.id));
          setSelectedCategoryIds(initial);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await preferenceService.updatePreferences({
        maxBudget,
        preferredDuration,
        preferredGroupType,
        city,
        categoryIds: Array.from(selectedCategoryIds),
      });
      navigate('/discover');
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-4 py-12">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? 'Budget' : step === 2 ? 'Vibe & Time' : 'Interests'}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: BUDGET */}
          {step === 1 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-3">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Student Affordability</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">What is your typical hangout budget?</h2>
              <p className="text-sm text-slate-400 mb-6">
                We'll prioritize recommendations that respect your wallet.
              </p>

              <div className="space-y-3">
                {BUDGET_OPTIONS.map((opt) => {
                  const isSelected = maxBudget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setMaxBudget(opt.value)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-base">{opt.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.sub}</div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DURATION & GROUP TYPE */}
          {step === 2 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Time & Social Style</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">How do you usually hang out?</h2>
              <p className="text-sm text-slate-400 mb-6">
                Tell us your preferred hangout duration and who you usually go with.
              </p>

              <div className="space-y-6">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Preferred Duration
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {DURATION_OPTIONS.map((opt) => {
                      const isSelected = preferredDuration === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setPreferredDuration(opt.value)}
                          className={`p-3.5 rounded-xl border text-left transition ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/10 text-white'
                              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-lg mr-1.5">{opt.icon}</span>
                          <span className="font-semibold text-sm">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group Style */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Hangout Dynamic
                  </label>
                  <div className="space-y-2.5">
                    {GROUP_OPTIONS.map((opt) => {
                      const isSelected = preferredGroupType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setPreferredGroupType(opt.value)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-sm text-white">{opt.label}</span>
                            <span className="text-xs text-slate-400 block">{opt.sub}</span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-orange-500 bg-orange-500 text-slate-950' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INTERESTS */}
          {step === 3 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>Interests & Vibes</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">What kind of activities excite you?</h2>
              <p className="text-sm text-slate-400 mb-6">
                Pick at least 2 interests to unlock tailored card recommendations.
              </p>

              {loadingCats ? (
                <div className="py-12 flex justify-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const isSelected = selectedCategoryIds.has(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/10 shadow'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white line-clamp-1">{cat.name}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-orange-500 bg-orange-500 text-slate-950' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="py-2.5 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="py-2.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 flex items-center gap-2 text-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="py-2.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Personalizing Deck...</span>
                  </>
                ) : (
                  <>
                    <span>Start Swiping!</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
