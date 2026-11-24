'use client';

import React from 'react';
import { Search, X, CheckSquare, Clock, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  areaId: string;
  onAreaChange: (val: string) => void;
  areas: { id: string; name: string; plant: { name: string } }[];
  myApprovalsOnly: boolean;
  onMyApprovalsToggle: () => void;
  expiringSoon: boolean;
  onExpiringSoonToggle: () => void;
  onReset: () => void;
  activeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  areaId,
  onAreaChange,
  areas,
  myApprovalsOnly,
  onMyApprovalsToggle,
  expiringSoon,
  onExpiringSoonToggle,
  onReset,
  activeCount,
}) => {
  const isFiltered = Boolean(search || status || type || areaId || myApprovalsOnly || expiringSoon);

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 space-y-3">
      {/* Top Row: Search and Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
        {/* Search */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Permit #, Title, or Equipment tag..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 placeholder-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700 bg-slate-50/50 hover:bg-white transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">● Active (On Site)</option>
            <option value="PENDING_APPROVAL">⏳ Pending Approval</option>
            <option value="APPROVED">✓ Approved</option>
            <option value="SUSPENDED">⚠ Suspended</option>
            <option value="CLOSED">🔒 Closed</option>
            <option value="EXPIRED">⌛ Expired</option>
            <option value="REJECTED">✕ Rejected</option>
            <option value="DRAFT">📝 Draft</option>
          </select>
        </div>

        {/* Type Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700 bg-slate-50/50 hover:bg-white transition-colors"
          >
            <option value="">All Permit Types</option>
            <option value="HOT_WORK">🔥 Hot Work</option>
            <option value="CONFINED_SPACE">📦 Confined Space</option>
            <option value="WORKING_AT_HEIGHT">🪜 Height Work</option>
            <option value="ELECTRICAL_LOTO">⚡ Electrical LOTO</option>
            <option value="CHEMICAL_HANDLING">🧪 Chemical Handling</option>
            <option value="COLD_WORK">❄️ Cold Work</option>
          </select>
        </div>

        {/* Plant / Area Dropdown */}
        <div className="lg:col-span-3">
          <select
            value={areaId}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700 bg-slate-50/50 hover:bg-white transition-colors truncate"
          >
            <option value="">All Plants & Areas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.plant.name.split(' ')[0]} • {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Quick Toggles and Active Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Quick:
          </span>

          {/* My Approvals Pending Toggle */}
          <button
            type="button"
            onClick={onMyApprovalsToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              myApprovalsOnly
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-current" />
            <span>My Approvals Pending</span>
          </button>

          {/* Expiring Soon Toggle */}
          <button
            type="button"
            onClick={onExpiringSoonToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              expiringSoon
                ? 'bg-red-600 text-white border-red-700 shadow-sm font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-current" />
            <span>Expiring Soon (&lt; 2h)</span>
          </button>
        </div>

        {/* Right: Matches Count & Clear */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium text-xs">
            Showing <strong className="text-slate-800">{activeCount}</strong> permits
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
