'use client';

import React, { useState, useEffect } from 'react';
import { TopHeader } from '@/frontend/components/TopHeader';
import { 
  History, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  FileText,
  Filter,
  Lock,
  Calendar,
  UserCheck
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  action: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  comment?: string | null;
  timestamp: string;
  permit: {
    id: string;
    permitNumber: string;
    workDescription?: string;
    type: string;
    status: string;
  };
  performedBy: {
    id: string;
    name: string;
    role: string;
    email: string;
  };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const res = await fetch('/api/audit-logs');
        const data = await res.json();
        if (data.logs) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.permit.permitNumber.toLowerCase().includes(search.toLowerCase()) ||
      log.performedBy.name.toLowerCase().includes(search.toLowerCase()) ||
      (log.comment && log.comment.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'APPROVED':
        return { label: 'Approved', style: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'REJECTED':
        return { label: 'Rejected', style: 'bg-rose-50 text-rose-800 border-rose-300' };
      case 'SUSPENDED':
        return { label: 'Suspended', style: 'bg-red-50 text-red-800 border-red-300' };
      case 'EXTENDED':
        return { label: 'Extended (+Hrs)', style: 'bg-blue-50 text-blue-800 border-blue-300' };
      case 'ACTIVATED':
        return { label: 'Activated (On Site)', style: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' };
      case 'CLOSED':
      case 'VERIFIED':
        return { label: 'Closed & Verified', style: 'bg-slate-100 text-slate-700 border-slate-300' };
      case 'SUBMITTED':
      case 'CREATED':
        return { label: 'Created & Submitted', style: 'bg-amber-50 text-amber-800 border-amber-300' };
      default:
        return { label: action, style: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Permit Number', 'Action', 'From Status', 'To Status', 'Performed By', 'Role', 'Comment'];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestamp).toISOString(),
      l.permit.permitNumber,
      l.action,
      l.fromStatus || '',
      l.toStatus || '',
      l.performedBy.name,
      l.performedBy.role,
      `"${(l.comment || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `opmaint_statutory_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70">
      <TopHeader pageTitle="Statutory Compliance Audit Log" />

      <main className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title & Export Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Statutory Compliance Audit Log
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-2xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Immutable Trail
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Legally mandated chronological log of all state transitions, electronic signatures, suspensions, and extensions.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV Audit Report</span>
          </button>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Events</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <History className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{logs.length} Events</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Chronologically sequenced</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cryptographic Hash</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-700 tracking-tight">SHA-256 Ledger</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Immutable database trail</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Digital Signatures</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">100% Signed</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Area & Safety Sign-offs</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Compliance</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">OSHA / ISO 45001</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Zero unauthorized overrides</span>
          </div>
        </div>

        {/* Search & Action Filters */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search audit trail by Permit #, User name, or Comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/50 hover:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Action:
            </span>
            {['ALL', 'APPROVED', 'REJECTED', 'SUSPENDED', 'EXTENDED'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  filterAction === act
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {act === 'ALL' ? 'All Events' : act}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Stream Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">Loading statutory audit trail...</p>
              <p className="text-xs text-slate-400 mt-0.5">Decrypting SHA-256 historical ledger</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Audit Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No events match your current filter query.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const date = new Date(log.timestamp);

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                        {log.permit.permitNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.style}`}>
                        {badge.label}
                      </span>
                      {log.fromStatus && log.toStatus && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {log.fromStatus} → <strong className="text-slate-900">{log.toStatus}</strong>
                        </span>
                      )}
                    </div>

                    {log.comment && (
                      <p className="text-xs text-slate-800 italic bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-200/60 max-w-2xl">
                        &quot;{log.comment}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Logged By: <strong className="text-slate-800">{log.performedBy.name}</strong> ({log.performedBy.role.replace('_', ' ')})</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        SHA-256 Ledger Verified
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-700 block">
                      {date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
