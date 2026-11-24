'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  ChevronDown, 
  Plus, 
  ShieldCheck, 
  Building2, 
  HardHat, 
  UserCog,
  Check,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
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
        return { 
          label: 'Requester', 
          desc: 'Maintenance & Contractor',
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', 
          avatarBg: 'bg-blue-600 text-white',
          icon: HardHat 
        };
      case 'AREA_OWNER':
        return { 
          label: 'Area Owner', 
          desc: 'Plant Area Operations',
          badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', 
          avatarBg: 'bg-purple-600 text-white',
          icon: Building2 
        };
      case 'SAFETY_OFFICER':
        return { 
          label: 'Safety Officer', 
          desc: 'EHS & Hazard Control',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
          avatarBg: 'bg-emerald-600 text-white',
          icon: ShieldCheck 
        };
      case 'ADMIN':
        return { 
          label: 'Plant Admin', 
          desc: 'Superintendent & Audit',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', 
          avatarBg: 'bg-amber-600 text-white',
          icon: UserCog 
        };
      default:
        return { 
          label: role, 
          desc: 'User',
          badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', 
          avatarBg: 'bg-slate-700 text-white',
          icon: HardHat 
        };
    }
  };

  const currentRole = currentUser ? getRoleConfig(currentUser.role) : null;
  const CurrentIcon = currentRole ? currentRole.icon : HardHat;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all duration-200">
              <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  OPMAINT
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  PTW
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Permit to Work & Safety CMMS</span>
            </div>
          </Link>

          {/* Right: Persona Switcher & New Permit */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 1-Click Role Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${currentRole?.avatarBg}`}>
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {currentUser?.name || 'Loading...'}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${currentRole?.badgeBg}`}>
                      {currentRole?.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Click to switch demo persona
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Persona Switcher Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Demo Persona Switcher</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Switch roles instantly to test permissions and approvals without logging in again.
                    </p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {allUsers.map((user) => {
                      const roleConfig = getRoleConfig(user.role);
                      const isSelected = currentUser?.id === user.id;

                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'bg-amber-500/10 border border-amber-500/30 text-white' 
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${roleConfig.avatarBg}`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                {user.name}
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                              </div>
                              <div className="text-[11px] text-slate-400 font-normal">
                                {roleConfig.desc}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleConfig.badgeBg}`}>
                              {roleConfig.label}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Create Permit CTA Button */}
            <Link
              href="/permits/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">New Safety Permit</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
