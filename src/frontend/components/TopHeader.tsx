'use client';

import React from 'react';
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  MapPin, 
  Layers,
  Sparkles
} from 'lucide-react';

interface TopHeaderProps {
  onRefresh?: () => void;
  refreshing?: boolean;
  pageTitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onRefresh, refreshing, pageTitle = 'Permit Register' }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none max-w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3 min-w-0">
        {/* Left: Breadcrumbs & Plant Facility Context */}
        <div className="flex items-center gap-3 min-w-0 shrink">
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <span className="text-slate-400 font-semibold">Opmaint CMMS</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-950 font-extrabold flex items-center gap-1.5">
              <span>{pageTitle}</span>
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 min-w-0 truncate">
            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate">Facility: Chennai Automotive Assembly Plant</span>
          </div>
        </div>

        {/* Right: Shift Status & Refresh */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Shift status badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Shift: <strong className="text-slate-800">General (A)</strong></span>
          </div>

          {/* Plant Safety Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Safety</span>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all hover:border-slate-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
