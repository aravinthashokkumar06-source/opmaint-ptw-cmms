'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountdownTimer } from './CountdownTimer';
import { 
  Flame, 
  Box, 
  ArrowUpRight, 
  Zap, 
  FlaskConical, 
  Snowflake, 
  ShieldAlert, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';

export interface PermitListItem {
  id: string;
  permitNumber: string;
  title?: string;
  workDescription?: string;
  type: string;
  status: string;
  plannedStartTime?: string;
  plannedEndTime?: string;
  plannedStart?: string;
  plannedEnd?: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  plant: { id: string; name: string };
  area: { id: string; name: string };
  equipment: { id: string; name: string; tag?: string; tagNumber?: string };
  requester: { id: string; name: string; email?: string; department?: string | null };
  approvals: {
    id: string;
    roleRequired?: string;
    role?: string;
    status: string;
    approver?: { name: string } | null;
  }[];
}

interface PermitTableProps {
  permits: PermitListItem[];
  loading: boolean;
}

export const PermitTable: React.FC<PermitTableProps> = ({ permits, loading }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'HOT_WORK':
        return { label: 'Hot Work', icon: Flame, style: 'bg-orange-50 text-orange-700 border-orange-200/90' };
      case 'CONFINED_SPACE':
        return { label: 'Confined Space', icon: Box, style: 'bg-purple-50 text-purple-700 border-purple-200/90' };
      case 'WORKING_AT_HEIGHT':
        return { label: 'Height Work', icon: ArrowUpRight, style: 'bg-sky-50 text-sky-700 border-sky-200/90' };
      case 'ELECTRICAL_LOTO':
        return { label: 'Electrical LOTO', icon: Zap, style: 'bg-amber-50 text-amber-700 border-amber-200/90' };
      case 'CHEMICAL_HANDLING':
        return { label: 'Chemical Handling', icon: FlaskConical, style: 'bg-emerald-50 text-emerald-700 border-emerald-200/90' };
      case 'COLD_WORK':
        return { label: 'Cold Work', icon: Snowflake, style: 'bg-cyan-50 text-cyan-700 border-cyan-200/90' };
      default:
        return { label: type, icon: ShieldAlert, style: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Active', style: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold', dot: 'bg-emerald-500 animate-ping' };
      case 'PENDING_APPROVAL':
        return { label: 'Pending', style: 'bg-amber-50 text-amber-900 border-amber-300 font-bold', dot: 'bg-amber-500 animate-pulse' };
      case 'APPROVED':
        return { label: 'Approved', style: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold', dot: 'bg-blue-500' };
      case 'SUSPENDED':
        return { label: 'Suspended', style: 'bg-red-100 text-red-900 border-red-300 font-bold', dot: 'bg-red-600 animate-bounce' };
      case 'CLOSED':
      case 'CLOSED_VERIFIED':
        return { label: 'Closed', style: 'bg-slate-100 text-slate-700 border-slate-300 font-medium', dot: 'bg-slate-400' };
      case 'EXPIRED':
        return { label: 'Expired', style: 'bg-red-50 text-red-700 border-red-200 font-semibold', dot: 'bg-red-600' };
      case 'REJECTED':
        return { label: 'Rejected', style: 'bg-red-50 text-red-700 border-red-200 font-semibold', dot: 'bg-red-600' };
      case 'DRAFT':
        return { label: 'Draft', style: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' };
      default:
        return { label: status, style: 'bg-slate-50 text-slate-700 border-slate-300', dot: 'bg-slate-400' };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center shadow-2xs">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading industrial safety permits...</p>
        <p className="text-xs text-slate-400 mt-0.5">Syncing with plant safety register</p>
      </div>
    );
  }

  if (permits.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Permits Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
          No permits match the selected filter criteria. Try clearing search filters or create a new permit.
        </p>
        <Link
          href="/permits/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-transform hover:scale-105"
        >
          Create New Permit
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden w-full">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 min-w-[220px] sticky left-0 bg-slate-50/95 z-20 shadow-[6px_0_10px_-4px_rgba(0,0,0,0.06)]">Permit Details</th>
              <th className="py-3 px-3 w-[140px] whitespace-nowrap">Safety Type</th>
              <th className="py-3 px-3 w-[180px]">Plant & Area</th>
              <th className="py-3 px-3 w-[110px] whitespace-nowrap">Status</th>
              <th className="py-3 px-3 w-[130px] whitespace-nowrap">Validity</th>
              <th className="py-3 px-2 w-[70px] text-center whitespace-nowrap">Approvals</th>
              <th className="py-3 pr-4 pl-3 w-[105px] text-right whitespace-nowrap sticky right-0 bg-slate-50/95 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] z-20">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {permits.map((permit) => {
              const typeBadge = getTypeBadge(permit.type);
              const statusBadge = getStatusBadge(permit.status);
              const TypeIcon = typeBadge.icon;

              const totalRequired = permit.approvals?.length || 0;
              const approvedCount = permit.approvals?.filter(a => a.status === 'APPROVED').length || 0;
              const titleText = permit.title || permit.workDescription || 'Maintenance Work';
              const plannedEnd = permit.plannedEndTime || permit.plannedEnd;
              const equipmentTag = permit.equipment.tag || permit.equipment.tagNumber || '';

              return (
                <tr 
                  key={permit.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => window.location.href = `/permits/${permit.id}`}
                >
                  {/* Column 1: Permit Details (Sticky Left) */}
                  <td className="py-3.5 px-4 align-top sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200/80 group-hover:border-amber-400 transition-colors">
                          {permit.permitNumber}
                        </span>
                        <button
                          onClick={(e) => copyToClipboard(permit.permitNumber, e)}
                          title="Copy Permit Number"
                          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                        >
                          {copiedId === permit.permitNumber ? (
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </div>

                      <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-amber-800 transition-colors" title={titleText}>
                        {titleText}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <span className="text-slate-400">Target:</span>
                        <span className="font-medium text-slate-700 truncate">
                          {permit.equipment.name}
                        </span>
                        {equipmentTag && (
                          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {equipmentTag}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Safety Type */}
                  <td className="py-3.5 px-3 align-top whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold border ${typeBadge.style}`}>
                      <TypeIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{typeBadge.label}</span>
                    </span>
                  </td>

                  {/* Column 3: Plant & Area */}
                  <td className="py-3.5 px-3 align-top">
                    <div className="font-bold text-slate-800 text-xs leading-snug truncate">
                      {permit.area.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal leading-snug truncate mt-0.5">
                      {permit.plant.name}
                    </div>
                  </td>

                  {/* Column 4: Status */}
                  <td className="py-3.5 px-3 align-top whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs border ${statusBadge.style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                      <span>{statusBadge.label}</span>
                    </span>
                  </td>

                  {/* Column 5: Validity / Countdown */}
                  <td className="py-3.5 px-3 align-top whitespace-nowrap">
                    <CountdownTimer plannedEnd={plannedEnd} status={permit.status} />
                  </td>

                  {/* Column 6: Approvals */}
                  <td className="py-3.5 px-2 align-top text-center whitespace-nowrap">
                    {totalRequired > 0 ? (
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <span className={`text-xs font-black ${approvedCount === totalRequired ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {approvedCount}/{totalRequired}
                        </span>
                        <div className="flex items-center gap-1">
                          {permit.approvals.map((app) => (
                            <span
                              key={app.id}
                              title={`${(app.roleRequired || app.role || '').replace('_', ' ')}: ${app.status}`}
                              className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'APPROVED'
                                  ? 'bg-emerald-500'
                                  : app.status === 'REJECTED'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">—</span>
                    )}
                  </td>

                  {/* Column 7: Action (STICKY RIGHT - Guaranteed 100% visible at all times!) */}
                  <td className="py-3.5 pr-4 pl-3 align-top text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] z-10">
                    <Link
                      href={`/permits/${permit.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all shadow-xs"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
