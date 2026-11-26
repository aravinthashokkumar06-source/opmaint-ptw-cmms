'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  X, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  FileText,
  Filter,
  Lock
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

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  if (!isOpen) return null;

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
        return { label: 'Approved', style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'REJECTED':
        return { label: 'Rejected', style: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      case 'SUSPENDED':
        return { label: 'Suspended', style: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 'EXTENDED':
        return { label: 'Extended (+Hrs)', style: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'ACTIVATED':
        return { label: 'Activated (On Site)', style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'CLOSED':
      case 'VERIFIED':
        return { label: 'Closed & Verified', style: 'bg-slate-700/50 text-slate-300 border-slate-600' };
      case 'SUBMITTED':
      case 'CREATED':
        return { label: 'Created & Submitted', style: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      default:
        return { label: action, style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Permit Number', 'Action', 'Performed By', 'Role', 'Comment'];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestamp).toISOString(),
      l.permit.permitNumber,
      l.action,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500/20 to-sky-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <History className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-tight">Immutable Compliance Audit Log</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Statutory Grade
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically tracked lifecycle events, sign-offs, suspensions, and extensions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              disabled={filteredLogs.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Action Filters */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Permit #, User name, or Comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold mr-1">Action:</span>
            {['ALL', 'APPROVED', 'REJECTED', 'SUSPENDED', 'EXTENDED'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  filterAction === act
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {act === 'ALL' ? 'All Events' : act}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries Timeline Stream */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-slate-400">Querying immutable safety audit trail...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-400">No audit logs matching your criteria</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const date = new Date(log.timestamp);

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {log.permit.permitNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.style}`}>
                        {badge.label}
                      </span>
                      {log.fromStatus && log.toStatus && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {log.fromStatus} → <strong className="text-white">{log.toStatus}</strong>
                        </span>
                      )}
                    </div>

                    {log.comment && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800/80">
                        &quot;{log.comment}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Operator: <strong className="text-slate-200">{log.performedBy.name}</strong> ({log.performedBy.role.replace('_', ' ')})</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        SHA-256 Ledger
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs text-slate-300 block">
                      {date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Opmaint Compliance Engine • ISO 45001 & OSHA Audit Trail</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
