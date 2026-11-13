import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, ChevronUp, ChevronDown, MapPin, Clock, Users, IndianRupee, Sparkles, Building2, Star } from 'lucide-react';
import FeedbackTriggerButton from '../feedback/FeedbackTriggerButton';
import { CATEGORY_FALLBACK_IMAGES } from '../../data/delhiNcrZones';

export default function ExpandableActivityCard({ activity, onSwipe, isTopCard = true }) {
  const [expanded, setExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Framer motion drag tracking
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);

  // Stamp badge opacity
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (expanded) return; // Do not swipe when in expanded detail mode

    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe(activity.id, 'LIKE');
    } else if (info.offset.x < -threshold) {
      onSwipe(activity.id, 'REJECT');
    }
  };

  const fallbackUrl = CATEGORY_FALLBACK_IMAGES[activity.categoryId] || CATEGORY_FALLBACK_IMAGES.default;

  const rawImages = activity.imageGallery && activity.imageGallery.length > 0
    ? activity.imageGallery
    : [activity.coverImageUrl || fallbackUrl];

  const images = rawImages.map(img => img || fallbackUrl);

  const displayLocation = activity.areaFormatted || (
    activity.locality
      ? `${activity.locality} · ${activity.zone || activity.city}`
      : (activity.zone || activity.city || 'Delhi NCR')
  );

  return (
    <div className="relative w-full max-w-sm sm:max-w-md h-[580px] mx-auto select-none">
      <motion.div
        style={!expanded && isTopCard ? { x, rotate, opacity } : {}}
        drag={!expanded && isTopCard ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        className={`relative w-full h-full bg-[#111422] rounded-3xl border border-blue-500/20 shadow-2xl overflow-hidden flex flex-col justify-between ${
          isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
        }`}
      >
        {/* LIKE / REJECT Visual Stamps */}
        {!expanded && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 z-30 px-4 py-1.5 border-4 border-[#2B59FF] bg-[#2B59FF]/20 text-white font-extrabold text-2xl uppercase tracking-wider rounded-2xl rotate-[-12deg] pointer-events-none backdrop-blur-sm shadow-glow-blue"
            >
              LIKE
            </motion.div>
            <motion.div
              style={{ opacity: rejectOpacity }}
              className="absolute top-6 right-6 z-30 px-4 py-1.5 border-4 border-slate-300 bg-white/20 text-white font-extrabold text-2xl uppercase tracking-wider rounded-2xl rotate-[12deg] pointer-events-none backdrop-blur-sm"
            >
              PASS
            </motion.div>
          </>
        )}

        {/* Collapsed View (Primary Card Face) */}
        <div className="relative w-full h-full flex flex-col">
          {/* Main Photo */}
          <div className="relative w-full h-[65%] overflow-hidden bg-[#08090E]">
            <img
              src={images[0]}
              alt={activity.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackUrl;
              }}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111422] via-[#111422]/20 to-transparent" />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {activity.categoryName && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0B0C12]/80 backdrop-blur-md text-blue-400 border border-blue-500/30 shadow">
                  {activity.categoryName}
                </span>
              )}
              {activity.averageRating && activity.reviewCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0B0C12]/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{activity.averageRating} ({activity.reviewCount})</span>
                </span>
              )}
              {activity.distanceFormatted ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0B0C12]/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 flex items-center gap-1 shadow">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{activity.distanceFormatted}</span>
                </span>
              ) : activity.distanceKm != null ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0B0C12]/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 flex items-center gap-1 shadow">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{activity.distanceKm} km away</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Card Info Section */}
          <div className="flex-1 p-5 flex flex-col justify-between -mt-6 z-10 bg-[#111422]">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-white line-clamp-1">
                  {activity.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 font-medium">
                <div className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>
                    {activity.minCost === 0 && activity.maxCost === 0
                      ? 'FREE'
                      : `₹${activity.minCost} - ₹${activity.maxCost}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activity.durationMinutes} mins</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate max-w-[190px]" title={displayLocation}>{displayLocation}</span>
                </div>
              </div>
            </div>

            {/* Expand Prompt Button */}
            <button
              onClick={() => setExpanded(true)}
              className="w-full mt-3 py-2 px-3 rounded-2xl bg-[#171b30] hover:bg-[#1f2542] border border-blue-500/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>Tap for full details & photo gallery</span>
              <ChevronUp className="w-4 h-4 text-blue-400 animate-bounce" />
            </button>

            {/* Action Buttons: PASS (High-Contrast Pure White) and LIKE (Electric Cobalt Blue) */}
            <div className="flex items-center justify-center gap-8 pt-2">
              <button
                onClick={() => onSwipe(activity.id, 'REJECT')}
                aria-label="Pass activity"
                className="w-13 h-13 rounded-full bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95"
              >
                <X className="w-7 h-7 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onSwipe(activity.id, 'LIKE')}
                aria-label="Like activity"
                className="w-14 h-14 rounded-full bg-[#2B59FF] hover:bg-[#3870FF] text-white flex items-center justify-center shadow-xl shadow-blue-500/40 transition-all transform hover:scale-110 active:scale-95 font-bold"
              >
                <Heart className="w-7 h-7 fill-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Drawer Modal (Full-Screen Overlay) */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 bg-[#0B0C12] flex flex-col overflow-y-auto rounded-3xl"
            >
              {/* Top Bar with Collapse Header */}
              <div className="sticky top-0 z-30 bg-[#111422]/95 backdrop-blur-md px-5 py-3 border-b border-blue-500/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{activity.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-blue-400 font-semibold">{activity.categoryName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{displayLocation}</span>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-1.5 rounded-full bg-[#171b30] hover:bg-[#1f2542] border border-blue-500/20 text-slate-300 transition"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Gallery Carousel */}
              <div className="relative w-full h-64 bg-[#08090E]">
                <img
                  src={images[activeImageIndex] || fallbackUrl}
                  alt="Gallery"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackUrl;
                  }}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === activeImageIndex ? 'w-5 bg-[#2B59FF]' : 'w-2 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Expanded Details Body */}
              <div className="p-5 space-y-6 flex-1">
                {/* Description */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activity.description || 'A great hangout spot for students looking for memorable experiences without breaking the bank.'}
                  </p>
                </div>

                {/* Specs Grid (Screen 3 Statistics Card style) */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#131625] border border-blue-500/15">
                    <span className="text-slate-400 block mb-1">Group Fit</span>
                    <span className="font-bold text-white text-sm">{activity.groupType || 'Friends & Solo'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131625] border border-blue-500/15">
                    <span className="text-slate-400 block mb-1">Atmosphere</span>
                    <span className="font-bold text-white text-sm">{activity.locationType || 'Indoor/Outdoor'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131625] border border-blue-500/15">
                    <span className="text-slate-400 block mb-1">Best Time</span>
                    <span className="font-bold text-white text-sm">{activity.bestTime || 'Evening'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131625] border border-blue-500/15">
                    <span className="text-slate-400 block mb-1">Duration</span>
                    <span className="font-bold text-white text-sm">{activity.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Associated Spots / Places */}
                {activity.associatedSpots && activity.associatedSpots.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Associated Spots / Places</span>
                    </h5>
                    <div className="space-y-3">
                      {activity.associatedSpots.map((spot) => (
                        <div key={spot.id} className="p-3.5 rounded-2xl bg-[#131625] border border-blue-500/15 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h6 className="font-bold text-white text-sm">{spot.name}</h6>
                            {(spot.locality || spot.zone) && (
                              <span className="text-[11px] text-blue-400 font-medium">
                                {spot.locality ? `${spot.locality} · ${spot.zone || ''}` : spot.zone}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{spot.address}</p>
                          {spot.openingHours && (
                            <p className="text-xs text-cyan-400 font-mono">🕒 {spot.openingHours}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Bar in Expanded View (Screen 3 style dual action buttons) */}
              <div className="sticky bottom-0 bg-[#0B0C12]/95 backdrop-blur-md p-4 border-t border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setExpanded(false);
                      onSwipe(activity.id, 'REJECT');
                    }}
                    className="btn-white flex-1 py-3.5 rounded-full font-bold text-slate-950 shadow-md text-sm flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                    <span>Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      setExpanded(false);
                      onSwipe(activity.id, 'LIKE');
                    }}
                    className="btn-cobalt flex-1 py-3.5 rounded-full font-bold text-white shadow-lg shadow-blue-500/35 text-sm flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Love It</span>
                  </button>
                </div>

                {/* "Already visited? Add feedback" */}
                <FeedbackTriggerButton
                  activity={activity}
                  variant="expanded-card"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
