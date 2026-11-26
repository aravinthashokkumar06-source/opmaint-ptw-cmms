'use client';

import React from 'react';
import { FileText, Activity, ClockAlert, AlertTriangle, Check } from 'lucide-react';

interface MetricCardsProps {
  total: number;
  active: number;
  pending: number;
  expiringSoon: number;
  currentFilter: string;
  onFilterClick: (cardId: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  total,
  active,
  pending,
  expiringSoon,
  currentFilter,
  onFilterClick,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Logged',
      count: total,
      subtitle: 'All plant permits',
      icon: FileText,
      iconColor: 'text-slate-700',
      iconBg: 'bg-slate-100',
      badge: 'ALL',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
      activeStyles: 'bg-slate-100/90 border-slate-900 ring-2 ring-slate-900/20 shadow-md',
      inactiveStyles: 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50',
    },
    {
      id: 'ACTIVE',
      title: 'Active on Site',
      count: active,
      subtitle: 'Live safety work',
      icon: Activity,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      badge: 'LIVE',
      badgeColor: 'bg-emerald-600 text-white font-extrabold',
      activeStyles: 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/30 shadow-md',
      inactiveStyles: 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30',
      isPulse: true,
    },
    {
      id: 'PENDING_APPROVAL',
      title: 'Pending Approvals',
      count: pending,
      subtitle: 'Awaiting signature',
      icon: ClockAlert,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100',
      badge: 'ACTION',
      badgeColor: 'bg-amber-500 text-slate-950 font-extrabold',
      activeStyles: 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/30 shadow-md',
      inactiveStyles: 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30',
    },
    {
      id: 'EXPIRING',
      title: 'Expiring Soon',
      count: expiringSoon,
      subtitle: 'Under 2 hours left',
      icon: AlertTriangle,
      iconColor: 'text-red-700',
      iconBg: 'bg-red-100',
      badge: 'URGENT',
      badgeColor: 'bg-red-600 text-white font-extrabold',
      activeStyles: 'bg-red-50/90 border-red-600 ring-2 ring-red-600/30 shadow-md',
      inactiveStyles: 'bg-white border-slate-200 hover:border-red-300 hover:bg-red-50/30',
      isWarning: expiringSoon > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = currentFilter === c.id;

        return (
          <div
            key={c.id}
            onClick={() => onFilterClick(c.id)}
            role="button"
            tabIndex={0}
            className={`relative cursor-pointer p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 select-none ${
              isSelected ? c.activeStyles : c.inactiveStyles
            }`}
          >
            {/* Top row: Title & Icon */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                isSelected ? 'text-slate-900' : 'text-slate-500'
              }`}>
                {c.title}
              </span>
              <div className={`p-1.5 rounded-lg ${c.iconBg} ${c.iconColor} shadow-2xs`}>
                <Icon className={`w-3.5 h-3.5 ${c.isPulse ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Middle row: Big number & Subtitle */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {c.count}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  {c.subtitle}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5">
                {c.badge && (
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded shadow-2xs ${c.badgeColor}`}>
                    {c.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
