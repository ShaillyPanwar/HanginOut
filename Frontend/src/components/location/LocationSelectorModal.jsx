import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Globe2,
  Check,
  X,
  Compass,
  Building,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { DELHI_NCR_ZONES } from '../../data/delhiNcrZones';

export default function LocationSelectorModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onRequestGps,
  gpsLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'delhi' | 'ncr'

  // Filtered zones based on search query & active category tab
  const filteredZones = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DELHI_NCR_ZONES.filter((zone) => {
      // "All Delhi NCR" card is handled specially at the top
      if (zone.id === 'all') return false;

      // Filter by tab
      if (activeTab === 'delhi' && zone.category !== 'Delhi') return false;
      if (activeTab === 'ncr' && zone.category !== 'Delhi NCR') return false;

      if (!query) return true;

      // Match zone name
      if (zone.name.toLowerCase().includes(query)) return true;
      // Match description
      if (zone.description.toLowerCase().includes(query)) return true;
      // Match any of its localities
      return zone.localities.some((loc) => loc.toLowerCase().includes(query));
    });
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  const isCurrentAllDelhi = !currentLocation || currentLocation.type === 'all' || currentLocation.label === 'All Delhi NCR';
  const isCurrentGps = currentLocation?.type === 'gps' || currentLocation?.source === 'gps';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0B0C12] border border-blue-500/20 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2B59FF] to-[#60A5FA] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MapPin className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Explore Delhi NCR</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                  15 Zones
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a zone or search any neighbourhood to discover student spots
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close location selector"
            className="p-2 rounded-full bg-[#131625] text-slate-400 hover:text-white hover:bg-[#1a1e33] border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Field & Fast Action Cards */}
        <div className="p-5 sm:p-6 pt-4 pb-3 space-y-3 bg-[#0B0C12]/95 border-b border-slate-800/80">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, neighbourhood or landmark (e.g. Hauz Khas, NSP, Cyber Hub)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#08090E] border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action Top Cards: "All Delhi NCR" & "Use GPS" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. All Delhi NCR (Default option) */}
            <button
              type="button"
              onClick={() => {
                onSelectLocation({
                  type: 'all',
                  label: 'All Delhi NCR',
                  zone: null,
                  locality: null,
                  latitude: null,
                  longitude: null,
                  source: 'all',
                });
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                isCurrentAllDelhi && !isCurrentGps
                  ? 'bg-blue-500/10 border-[#2B59FF] shadow-lg shadow-blue-500/15'
                  : 'bg-[#131625]/70 border-slate-800/80 hover:border-blue-500/30 hover:bg-[#131625]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>All Delhi NCR</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold uppercase">
                      Default
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Diverse feed across all 15 zones</div>
                </div>
              </div>
              {isCurrentAllDelhi && !isCurrentGps && (
                <div className="w-5 h-5 rounded-full bg-[#2B59FF] text-white flex items-center justify-center flex-shrink-0 ml-2 shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>

            {/* 2. Prominent GPS Location */}
            <button
              type="button"
              disabled={gpsLoading}
              onClick={() => {
                if (onRequestGps) onRequestGps();
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                isCurrentGps
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/15'
                  : 'bg-[#131625]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#131625]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  {gpsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4 fill-cyan-400" />
                  )}
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>Use my current location</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {isCurrentGps ? (currentLocation?.label || 'GPS Active') : 'Detect accurate GPS coordinates'}
                  </div>
                </div>
              </div>
              {isCurrentGps && (
                <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center flex-shrink-0 ml-2">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          </div>

          {/* Category Tabs: All Zones | Delhi Zones (11) | NCR Outer Cities (4) (Screen 3 style) */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-[#131625] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Zones ({DELHI_NCR_ZONES.length - 1})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('delhi')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'delhi'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-[#131625] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Delhi City (11)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ncr')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'ncr'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-[#131625] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              NCR Outer (4)
            </button>
          </div>
        </div>

        {/* Scrollable Zones List */}
        <div className="p-5 sm:p-6 pt-3 overflow-y-auto space-y-3 flex-1">
          {filteredZones.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-slate-300">No matching areas found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for another neighbourhood like "Hauz Khas", "Rohini", or "Cyber Hub"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredZones.map((zone) => {
                const isSelectedZone =
                  !isCurrentGps &&
                  !isCurrentAllDelhi &&
                  (currentLocation?.zone === zone.name || currentLocation?.label === zone.name);

                return (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all group relative cursor-pointer ${
                      isSelectedZone
                        ? 'bg-blue-500/10 border-[#2B59FF] shadow-md shadow-blue-500/15'
                        : 'bg-[#131625]/60 border-slate-800/80 hover:border-blue-500/30 hover:bg-[#131625]'
                    }`}
                    onClick={() => {
                      onSelectLocation({
                        type: 'zone',
                        label: zone.name,
                        zone: zone.name,
                        locality: null,
                        latitude: zone.coordinates?.latitude,
                        longitude: zone.coordinates?.longitude,
                        source: 'manual',
                      });
                      onClose();
                    }}
                  >
                    <div>
                      {/* Zone Header */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#2B59FF]" />
                          <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                            {zone.name}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">
                          {zone.category}
                        </span>
                      </div>

                      {/* Area Description */}
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                        {zone.description}
                      </p>

                      {/* Localities Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {zone.localities.map((loc) => {
                          const isLocalitySelected =
                            currentLocation?.locality &&
                            currentLocation.locality.toLowerCase() === loc.toLowerCase();

                          return (
                            <button
                              key={loc}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectLocation({
                                  type: 'locality',
                                  label: `${loc}, ${zone.name}`,
                                  zone: zone.name,
                                  locality: loc,
                                  latitude: zone.coordinates?.latitude,
                                  longitude: zone.coordinates?.longitude,
                                  source: 'manual',
                                });
                                onClose();
                              }}
                              className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition ${
                                isLocalitySelected
                                  ? 'bg-[#2B59FF] text-white font-bold border-[#2B59FF]'
                                  : 'bg-[#171A2E] border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-[#1e233d]'
                              }`}
                            >
                              {loc}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Status / Selection Check */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-blue-400 font-medium group-hover:underline inline-flex items-center gap-1">
                        <span>Select Zone</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                      {isSelectedZone && (
                        <span className="inline-flex items-center gap-1 text-blue-400 font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Active Zone</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
