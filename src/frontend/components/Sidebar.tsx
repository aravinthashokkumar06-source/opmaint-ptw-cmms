'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  FileText, 
  PlusCircle, 
  Building2, 
  History, 
  ChevronDown, 
  Check, 
  Sparkles,
  HardHat,
  ShieldCheck,
  UserCog,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, allUsers, switchUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'REQUESTER':
        return { label: 'Requester', desc: 'Maintenance Crew', badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', avatarBg: 'bg-blue-600 text-white', icon: HardHat };
      case 'AREA_OWNER':
        return { label: 'Area Owner', desc: 'Plant Operations', badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', avatarBg: 'bg-purple-600 text-white', icon: Building2 };
      case 'SAFETY_OFFICER':
        return { label: 'Safety Officer', desc: 'EHS & Hazard Control', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', avatarBg: 'bg-emerald-600 text-white', icon: ShieldCheck };
      case 'ADMIN':
        return { label: 'Plant Admin', desc: 'Superintendent', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', avatarBg: 'bg-amber-600 text-white', icon: UserCog };
      default:
        return { label: role, desc: 'Technician', badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', avatarBg: 'bg-slate-700 text-white', icon: HardHat };
    }
  };

  const currentRole = currentUser ? getRoleConfig(currentUser.role) : null;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/90 text-slate-300 flex flex-col justify-between shrink-0 h-screen select-none z-40">
      {/* Top Brand Identity & Nav Items */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Logo & Header */}
        <a href="/" className="flex items-center gap-3 group px-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
            <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                OPMAINT
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 border border-slate-700">
                CMMS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Permit to Work Module</p>
          </div>
        </a>

        {/* Live System Safety Beacon - Navigates directly to /radar */}
        <a
          href="/radar"
          className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all group shadow-xs ${
            pathname === '/radar'
              ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors">
              Safety Radar Active
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            0 Conflicts
          </span>
        </a>

        {/* Issue Safety Permit Button */}
        <a
          href="/permits/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 stroke-[3]" />
          <span>Issue Safety Permit</span>
        </a>

        {/* Navigation Section */}
        <nav className="space-y-1 pt-1">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            Safety Operations
          </div>

          {/* 1. Permits Register (Dashboard) */}
          <a
            href="/"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border outline-none ${
              pathname === '/'
                ? 'bg-slate-800 text-white font-bold border-slate-700 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 ${pathname === '/' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Permits Register</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
              pathname === '/' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              10
            </span>
          </a>

          {/* 2. Plant & Assets (Dedicated Page /assets) */}
          <a
            href="/assets"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border outline-none ${
              pathname === '/assets'
                ? 'bg-slate-800 text-white font-bold border-slate-700 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={`w-4 h-4 ${pathname === '/assets' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Plant & Assets</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
              pathname === '/assets' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              6 eq
            </span>
          </a>

          {/* 3. Hazard Conflict Radar (Dedicated Page /radar) */}
          <a
            href="/radar"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border outline-none ${
              pathname === '/radar'
                ? 'bg-slate-800 text-white font-bold border-slate-700 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className={`w-4 h-4 ${pathname === '/radar' ? 'text-emerald-400' : 'text-emerald-400'}`} />
              <span>Hazard Conflict Radar</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </a>

          {/* 4. Compliance Audit Log (Dedicated Page /audit-logs) */}
          <a
            href="/audit-logs"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border outline-none ${
              pathname === '/audit-logs'
                ? 'bg-slate-800 text-white font-bold border-slate-700 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className={`w-4 h-4 ${pathname === '/audit-logs' ? 'text-blue-400' : 'text-blue-400'}`} />
              <span>Compliance Audit Log</span>
            </div>
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
              pathname === '/audit-logs'
                ? 'bg-blue-500 text-white border-blue-400'
                : 'text-blue-400/80 bg-blue-500/10 border-blue-500/20'
            }`}>
              Audit
            </span>
          </a>
        </nav>
      </div>

      {/* Bottom User Persona Switcher */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0" ref={dropdownRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-left group focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${currentRole?.avatarBg}`}>
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span>{currentUser?.name || 'Loading...'}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span className={`px-1 rounded text-[9px] font-bold border ${currentRole?.badgeBg}`}>
                    {currentRole?.label}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
              dropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Floating Persona Popover */}
          {dropdownOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Switch Role (Test Permissions)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Simulate different plant roles instantly without re-login.
                </p>
              </div>

              <div className="p-1 space-y-1 max-h-60 overflow-y-auto">
                {allUsers.map((user) => {
                  const roleConfig = getRoleConfig(user.role);
                  const isSelected = currentUser?.id === user.id;

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          switchUser(user.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border border-amber-500/30 text-white font-bold'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${roleConfig.avatarBg}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {roleConfig.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleConfig.badgeBg}`}>
                            {roleConfig.label}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                        </div>
                      </button>
                    );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
