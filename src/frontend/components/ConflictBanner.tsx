'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, Flame, Box, Zap } from 'lucide-react';

export interface ConflictingPermit {
  id: string;
  permitNumber: string;
  type: string;
  status: string;
  areaName: string;
  startTime: string;
  endTime: string;
  warningMessage: string;
}

interface ConflictBannerProps {
  conflicts: ConflictingPermit[];
}

export const ConflictBanner: React.FC<ConflictBannerProps> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-red-50/95 p-5 shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-sm shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-red-950 uppercase tracking-wider flex items-center gap-2">
              <span>Safety Collision / Hazard Conflict Warning</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white">
                {conflicts.length} Overlap{conflicts.length > 1 ? 's' : ''} Detected
              </span>
            </h4>
          </div>

          <p className="text-xs text-red-900 leading-relaxed font-medium">
            The safety algorithm detected concurrent high-hazard work scheduled in the same physical plant area during overlapping time windows. Working concurrently creates catastrophic fire or atmospheric risks!
          </p>

          <div className="mt-3 space-y-2">
            {conflicts.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-white/90 border border-red-200 text-xs shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {c.permitNumber}
                  </span>
                  <span className="text-slate-600 font-semibold">
                    Area: <span className="text-slate-900">{c.areaName}</span>
                  </span>
                  <span className="text-red-700 font-extrabold">
                    {c.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-red-800 font-semibold flex items-center gap-1.5 pt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  <span>{c.warningMessage}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-red-800/90 font-medium">
            💡 <strong>Safety Recommendation:</strong> Adjust planned time window to avoid overlap, or coordinate with the Area Owner to stagger work schedules before submitting.
          </div>
        </div>
      </div>
    </div>
  );
};
