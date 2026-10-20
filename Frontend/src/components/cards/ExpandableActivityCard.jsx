import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, ChevronUp, ChevronDown, MapPin, Clock, Users, IndianRupee, Sparkles, Building2 } from 'lucide-react';

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

  const images = activity.imageGallery && activity.imageGallery.length > 0
    ? activity.imageGallery
    : [activity.coverImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'];

  return (
    <div className="relative w-full max-w-sm sm:max-w-md h-[580px] mx-auto select-none">
      <motion.div
        style={!expanded && isTopCard ? { x, rotate, opacity } : {}}
        drag={!expanded && isTopCard ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        className={`relative w-full h-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between ${
          isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
        }`}
      >
        {/* LIKE / REJECT Visual Stamps */}
        {!expanded && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 z-30 px-4 py-1.5 border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl uppercase tracking-wider rounded-xl rotate-[-12deg] pointer-events-none"
            >
              LIKE
            </motion.div>
            <motion.div
              style={{ opacity: rejectOpacity }}
              className="absolute top-6 right-6 z-30 px-4 py-1.5 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl uppercase tracking-wider rounded-xl rotate-[12deg] pointer-events-none"
            >
              PASS
            </motion.div>
          </>
        )}

        {/* Collapsed View (Primary Card Face) */}
        <div className="relative w-full h-full flex flex-col">
          {/* Main Photo */}
          <div className="relative w-full h-[65%] overflow-hidden bg-slate-950">
            <img
              src={images[0]}
              alt={activity.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {activity.categoryName && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-orange-400 border border-slate-700/60 shadow">
                  {activity.categoryName}
                </span>
              )}
              {activity.score != null && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{activity.score}% Match</span>
                </span>
              )}
            </div>
          </div>

          {/* Card Info Section */}
          <div className="flex-1 p-5 flex flex-col justify-between -mt-6 z-10 bg-slate-900">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-white line-clamp-1">
                  {activity.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 font-medium">
                <div className="flex items-center gap-1 text-emerald-400">
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

                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activity.city}</span>
                </div>
              </div>
            </div>

            {/* Expand Prompt Button */}
            <button
              onClick={() => setExpanded(true)}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>Tap for full details & photo gallery</span>
              <ChevronUp className="w-4 h-4 text-orange-400 animate-bounce" />
            </button>

            {/* Action Buttons: PASS and LIKE */}
            <div className="flex items-center justify-center gap-8 pt-2">
              <button
                onClick={() => onSwipe(activity.id, 'REJECT')}
                aria-label="Pass activity"
                className="w-13 h-13 rounded-full bg-slate-800/90 border border-slate-700 text-rose-400 hover:text-white hover:bg-rose-600 hover:border-rose-500 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95"
              >
                <X className="w-7 h-7" />
              </button>

              <button
                onClick={() => onSwipe(activity.id, 'LIKE')}
                aria-label="Like activity"
                className="w-15 h-15 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 hover:from-orange-600 hover:to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/25 transition-all transform hover:scale-110 active:scale-95 font-bold"
              >
                <Heart className="w-8 h-8 fill-slate-950" />
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
              className="absolute inset-0 z-50 bg-slate-950 flex flex-col overflow-y-auto rounded-3xl"
            >
              {/* Top Bar with Collapse Header */}
              <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{activity.title}</h4>
                  <span className="text-xs text-orange-400">{activity.categoryName}</span>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Gallery Carousel */}
              <div className="relative w-full h-64 bg-slate-900">
                <img
                  src={images[activeImageIndex]}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === activeImageIndex ? 'w-5 bg-orange-400' : 'bg-white/50'
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

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Group Fit</span>
                    <span className="font-semibold text-white">{activity.groupType || 'Friends & Solo'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Atmosphere</span>
                    <span className="font-semibold text-white">{activity.locationType || 'Indoor/Outdoor'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Best Time</span>
                    <span className="font-semibold text-white">{activity.bestTime || 'Evening'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Duration</span>
                    <span className="font-semibold text-white">{activity.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Associated Spots / Places */}
                {activity.associatedSpots && activity.associatedSpots.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Associated Spots / Places</span>
                    </h5>
                    <div className="space-y-3">
                      {activity.associatedSpots.map((spot) => (
                        <div key={spot.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                          <h6 className="font-bold text-white text-sm">{spot.name}</h6>
                          <p className="text-xs text-slate-400 leading-relaxed">{spot.address}</p>
                          {spot.openingHours && (
                            <p className="text-xs text-orange-400 font-mono">🕒 {spot.openingHours}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Bar in Expanded View */}
              <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md p-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setExpanded(false);
                    onSwipe(activity.id, 'REJECT');
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 font-bold text-sm border border-slate-700 hover:border-rose-500/40 transition flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Pass</span>
                </button>

                <button
                  onClick={() => {
                    setExpanded(false);
                    onSwipe(activity.id, 'LIKE');
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-500 transition flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-slate-950" />
                  <span>Love It</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
