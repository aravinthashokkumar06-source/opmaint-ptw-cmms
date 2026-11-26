'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  CheckSquare, 
  RotateCcw, 
  ChevronDown,
  Check
} from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  areaId: string;
  onAreaChange: (val: string) => void;
  areas: { id: string; name: string; plant: { name: string; code?: string } }[];
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

  // Popover state for each custom dropdown
  const [openDropdown, setOpenDropdown] = useState<'status' | 'type' | 'area' | null>(null);

  const statusRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        statusRef.current && !statusRef.current.contains(target) &&
        typeRef.current && !typeRef.current.contains(target) &&
        areaRef.current && !areaRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active (On Site)' },
    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'DRAFT', label: 'Draft' },
  ];

  // Type options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'HOT_WORK', label: 'Hot Work' },
    { value: 'CONFINED_SPACE', label: 'Confined Space' },
    { value: 'WORKING_AT_HEIGHT', label: 'Working at Height' },
    { value: 'ELECTRICAL_LOTO', label: 'Electrical LOTO' },
    { value: 'CHEMICAL_HANDLING', label: 'Chemical Handling' },
    { value: 'COLD_WORK', label: 'Cold Work' },
  ];

  const currentStatusObj = statusOptions.find(s => s.value === status);
  const currentStatusLabel = currentStatusObj?.label || 'All';
  const currentTypeObj = typeOptions.find(t => t.value === type);
  const currentTypeLabel = currentTypeObj?.label || 'All';
  const currentAreaObj = areas.find(a => a.id === areaId);
  const currentAreaLabel = currentAreaObj ? currentAreaObj.name : 'All Areas';

  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
      {/* Top Row: Search and Structured Enterprise Dropdowns */}
      <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Permit #, Title, or Equipment..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 placeholder-slate-400 bg-slate-50/50 hover:bg-white transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* The 3 Professional Dropdowns (Grouped) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* 1. STATUS DROPDOWN */}
          <div className="relative flex-1 sm:flex-initial" ref={statusRef}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3.5 py-2 text-xs rounded-xl border transition-all select-none ${
                status
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-400 font-normal">Status:</span>
                <span className="truncate">{status ? currentStatusLabel : 'All'}</span>
              </div>
              {status ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange('');
                  }}
                  className="p-0.5 rounded-full hover:bg-amber-200/80 text-amber-800 transition-colors"
                  title="Clear Status"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </span>
              ) : (
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  openDropdown === 'status' ? 'rotate-180' : ''
                }`} />
              )}
            </button>

            {/* Floating Popover Panel */}
            {openDropdown === 'status' && (
              <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="space-y-0.5 max-h-60 overflow-y-auto">
                  {statusOptions.map((opt) => {
                    const isSelected = status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onStatusChange(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors font-medium ${
                          isSelected
                            ? 'bg-amber-50 text-amber-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-100/70'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. PERMIT TYPE DROPDOWN */}
          <div className="relative flex-1 sm:flex-initial" ref={typeRef}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3.5 py-2 text-xs rounded-xl border transition-all select-none ${
                type
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-400 font-normal">Type:</span>
                <span className="truncate">{type ? currentTypeLabel : 'All'}</span>
              </div>
              {type ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTypeChange('');
                  }}
                  className="p-0.5 rounded-full hover:bg-amber-200/80 text-amber-800 transition-colors"
                  title="Clear Type"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </span>
              ) : (
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  openDropdown === 'type' ? 'rotate-180' : ''
                }`} />
              )}
            </button>

            {/* Floating Popover Panel */}
            {openDropdown === 'type' && (
              <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="space-y-0.5">
                  {typeOptions.map((opt) => {
                    const isSelected = type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onTypeChange(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors font-medium ${
                          isSelected
                            ? 'bg-amber-50 text-amber-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-100/70'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. PLANT & AREA DROPDOWN */}
          <div className="relative flex-1 sm:flex-initial" ref={areaRef}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
              className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3.5 py-2 text-xs rounded-xl border transition-all select-none ${
                areaId
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                <span className="text-slate-400 font-normal">Area:</span>
                <span className="truncate">{areaId ? currentAreaLabel : 'All Areas'}</span>
              </div>
              {areaId ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAreaChange('');
                  }}
                  className="p-0.5 rounded-full hover:bg-amber-200/80 text-amber-800 transition-colors"
                  title="Clear Area"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </span>
              ) : (
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  openDropdown === 'area' ? 'rotate-180' : ''
                }`} />
              )}
            </button>

            {/* Floating Popover Panel */}
            {openDropdown === 'area' && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="space-y-0.5 max-h-64 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onAreaChange('');
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors font-medium ${
                      !areaId
                        ? 'bg-amber-50 text-amber-950 font-bold'
                        : 'text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>All Plants & Areas</span>
                    {!areaId && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />}
                  </button>

                  {areas.map((a) => {
                    const isSelected = areaId === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          onAreaChange(a.id);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors font-medium ${
                          isSelected
                            ? 'bg-amber-50 text-amber-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-bold text-slate-900">{a.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {a.plant.name}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[2.5] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Toggles and Active Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* My Approvals Pending Toggle */}
          <button
            type="button"
            onClick={onMyApprovalsToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              myApprovalsOnly
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-current" />
            <span>My Approvals Pending</span>
          </button>
        </div>

        {/* Right: Matches Count & Clear */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium text-xs">
            Showing <strong className="text-slate-900 font-extrabold">{activeCount}</strong> permits
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
