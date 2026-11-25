'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/frontend/context/AuthContext';
import { CountdownTimer } from '@/frontend/components/CountdownTimer';
import { SignaturePadModal } from '@/frontend/components/SignaturePadModal';
import { 
  RejectModal, 
  SuspendModal, 
  ExtendModal, 
  QrCodeModal 
} from '@/frontend/components/ActionModals';
import { 
  ArrowLeft, 
  Flame, 
  Box, 
  ArrowUpRight, 
  Zap, 
  FlaskConical, 
  Snowflake, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertOctagon, 
  Building2, 
  HardHat, 
  QrCode, 
  PenTool, 
  Check, 
  Play, 
  AlertTriangle, 
  AlertCircle,
  Lock, 
  Copy,
  History,
  FileText,
  UserCheck,
  Calendar
} from 'lucide-react';

export default function PermitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const permitId = params.id as string;

  const [permit, setPermit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Modals state
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Fetch permit details
  const fetchPermit = useCallback(async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }
      const res = await fetch(`/api/permits/${permitId}`, { headers });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch permit details.');
      }
      setPermit(data.permit);
    } catch (err: any) {
      setActionError(err.message || 'Error loading permit.');
    } finally {
      setLoading(false);
    }
  }, [permitId, currentUser]);

  useEffect(() => {
    fetchPermit();
  }, [fetchPermit]);

  // Execute State Transition
  const handleTransition = async (action: string, payload: Record<string, any> = {}) => {
    try {
      setActionError(null);
      setActionSuccess(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }

      const res = await fetch(`/api/permits/${permitId}/transition`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to perform action: ${action}`);
      }

      setActionSuccess(`Successfully updated permit status to ${data.permit.status}!`);
      await fetchPermit();
    } catch (err: any) {
      setActionError(err.message || 'Error executing transition.');
      throw err;
    }
  };

  // Extend Validity Handler
  const handleExtend = async (extensionHours: number, reason: string) => {
    try {
      setActionError(null);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }

      const res = await fetch(`/api/permits/${permitId}/extend`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ extensionHours, reason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to extend permit.');
      }

      setActionSuccess(`Validity extended by +${extensionHours} hours!`);
      await fetchPermit();
    } catch (err: any) {
      setActionError(err.message || 'Error extending validity.');
      throw err;
    }
  };

  const copyPermitNumber = () => {
    if (permit?.permitNumber) {
      navigator.clipboard.writeText(permit.permitNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) {
    return (
      <main className="w-full px-6 lg:px-10 py-16 text-center">
        <div className="inline-block w-9 h-9 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-800">Loading permit details and immutable audit history...</p>
      </main>
    );
  }

  if (!permit) {
    return (
      <main className="w-full px-6 lg:px-10 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Permit Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
          {actionError || 'The requested permit ID could not be located in the plant safety registry.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </main>
    );
  }

  // Type Badges
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'HOT_WORK':
        return { label: 'Hot Work', icon: Flame, style: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'CONFINED_SPACE':
        return { label: 'Confined Space', icon: Box, style: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'WORKING_AT_HEIGHT':
        return { label: 'Height Work', icon: ArrowUpRight, style: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'ELECTRICAL_LOTO':
        return { label: 'Electrical LOTO', icon: Zap, style: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'CHEMICAL_HANDLING':
        return { label: 'Chemical Handling', icon: FlaskConical, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'COLD_WORK':
        return { label: 'Cold Work', icon: Snowflake, style: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      default:
        return { label: type, icon: ShieldAlert, style: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  // Status Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Active (On Site)', style: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold', dot: 'bg-emerald-500 animate-ping' };
      case 'PENDING_APPROVAL':
        return { label: 'Pending Approval', style: 'bg-amber-50 text-amber-900 border-amber-300 font-bold', dot: 'bg-amber-500 animate-pulse' };
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

  const typeMeta = getTypeBadge(permit.type);
  const TypeIcon = typeMeta.icon;
  const statusMeta = getStatusBadge(permit.status);

  // Check pending approval roles
  const areaOwnerApproval = permit.approvals?.find((a: any) => a.roleRequired === 'AREA_OWNER');
  const safetyOfficerApproval = permit.approvals?.find((a: any) => a.roleRequired === 'SAFETY_OFFICER');

  const isAreaOwner = currentUser?.role === 'AREA_OWNER' || currentUser?.role === 'ADMIN';
  const isSafetyOfficer = currentUser?.role === 'SAFETY_OFFICER' || currentUser?.role === 'ADMIN';
  const isRequester = currentUser?.id === permit.requesterId || currentUser?.role === 'ADMIN';

  const canAreaOwnerApprove =
    isAreaOwner &&
    permit.status === 'PENDING_APPROVAL' &&
    areaOwnerApproval &&
    areaOwnerApproval.status === 'PENDING';

  const canSafetyOfficerApprove =
    isSafetyOfficer &&
    permit.status === 'PENDING_APPROVAL' &&
    safetyOfficerApproval &&
    safetyOfficerApproval.status === 'PENDING';

  const canActivate =
    isRequester &&
    permit.status === 'APPROVED';

  const canSuspend =
    isSafetyOfficer &&
    permit.status === 'ACTIVE';

  const canClose =
    (isRequester || isAreaOwner || isSafetyOfficer) &&
    permit.status === 'ACTIVE';

  const canExtend =
    (isRequester || isAreaOwner || isSafetyOfficer) &&
    permit.status === 'ACTIVE';

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Safety Dashboard</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5">
              <span>{permit.permitNumber}</span>
              <button
                onClick={copyPermitNumber}
                title="Copy Permit Number"
                className="text-slate-400 hover:text-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${typeMeta.style}`}>
              <TypeIcon className="w-4 h-4" />
              <span>{typeMeta.label}</span>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs border ${statusMeta.style}`}>
              <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
              <span>{statusMeta.label}</span>
            </span>

            {permit.status === 'ACTIVE' && (
              <CountdownTimer plannedEnd={permit.plannedEndTime} status={permit.status} />
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {permit.title || permit.workDescription}
          </h1>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Field QR Code</span>
          </button>
        </div>
      </div>

      {/* Action Alerts */}
      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Role-Specific Action Banner (Contextual) */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300">
              Active Persona: <strong className="text-amber-400">{currentUser?.name}</strong> ({currentUser?.role})
            </div>
            <div className="text-[11px] text-slate-400">
              Available actions are automatically governed by state machine permissions and assigned area ownership.
            </div>
          </div>
        </div>

        {/* Contextual Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Area Owner Approval */}
          {canAreaOwnerApprove && (
            <>
              <button
                type="button"
                onClick={() => setIsSignModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-transform hover:scale-105"
              >
                <PenTool className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign as Area Owner</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          )}

          {/* Safety Officer Approval */}
          {canSafetyOfficerApprove && (
            <>
              <button
                type="button"
                onClick={() => setIsSignModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-transform hover:scale-105"
              >
                <PenTool className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign as Safety Officer</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          )}

          {/* Activate Permit */}
          {canActivate && (
            <button
              type="button"
              onClick={() => handleTransition('ACTIVATE')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Activate Permit (Commence Work)</span>
            </button>
          )}

          {/* Emergency Suspend */}
          {canSuspend && (
            <button
              type="button"
              onClick={() => setIsSuspendModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-md shadow-red-600/30 transition-transform hover:scale-105 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Suspend</span>
            </button>
          )}

          {/* Extend Validity */}
          {canExtend && (
            <button
              type="button"
              onClick={() => setIsExtendModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Extend (+Hours)</span>
            </button>
          )}

          {/* Close Permit */}
          {canClose && (
            <button
              type="button"
              onClick={() => handleTransition('CLOSE', { comment: 'Site housekeeping verified, work closed.' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Complete & Close</span>
            </button>
          )}

          {/* Submit Draft */}
          {permit.status === 'DRAFT' && isRequester && (
            <button
              type="button"
              onClick={() => handleTransition('SUBMIT')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-transform hover:scale-105"
            >
              <span>Submit for Approvals</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content 2-Column Split: Details (68%) & Immutable Audit Timeline (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================================================================== */}
        {/* LEFT COLUMN: PERMIT SPECIFICATIONS & DIGITAL SIGNATURES (68%) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Information Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Location Hierarchy & Contractor Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Plant Facility</span>
                <span className="font-extrabold text-slate-900 text-sm">{permit.plant.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block">{permit.plant.code}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Assigned Area</span>
                <span className="font-extrabold text-slate-900 text-sm">{permit.area.name}</span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Owner: {permit.area.owner?.name || 'Karthik Area Owner'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Target Equipment</span>
                <span className="font-extrabold text-slate-900 text-sm">{permit.equipment.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                  {permit.equipment.tag}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Assigned Contractor</span>
                <span className="font-bold text-slate-900">{permit.contractorName || 'In-House Maintenance'}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Permit Requester</span>
                <span className="font-bold text-slate-900">{permit.requester.name}</span>
                <span className="text-[10px] text-slate-400 block">{permit.requester.email}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Planned Validity Window</span>
                <span className="font-bold text-slate-900 font-mono">
                  {new Date(permit.plannedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(permit.plannedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {new Date(permit.plannedStartTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium block mb-1">Detailed Work Scope</span>
              <p className="text-slate-700 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                {permit.workDescription}
              </p>
            </div>
          </div>

          {/* Type-Specific Safety Parameters Card */}
          {permit.typeSpecificData && Object.keys(permit.typeSpecificData).length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
                <TypeIcon className="w-4 h-4 text-amber-600" />
                <span>Technical Safety Specifications ({typeMeta.label})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                {Object.entries(permit.typeSpecificData).map(([key, val]) => {
                  if (typeof val === 'object' && val !== null) {
                    return (
                      <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2 space-y-1">
                        <span className="font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <pre className="text-[11px] font-mono text-slate-600 overflow-x-auto">
                          {JSON.stringify(val, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 font-medium block capitalize text-[11px]">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hazards & Mandatory PPE Badges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Hazards Assessment & Mandatory Personal Protective Equipment
            </h3>

            <div>
              <span className="text-xs font-bold text-slate-600 block mb-2">Identified Hazards:</span>
              <div className="flex flex-wrap gap-2">
                {permit.hazardsIdentified?.map((h: string) => (
                  <span key={h} className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                    ⚠️ {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block mb-2">Mandatory PPE:</span>
              <div className="flex flex-wrap gap-2">
                {permit.ppeRequired?.map((p: string) => (
                  <span key={p} className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs">
                    🛡️ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Approval Signatures Trail Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Digital Authorization Trail & Signatures</span>
              <span className="text-xs font-mono text-slate-400">
                {permit.approvals?.filter((a: any) => a.status === 'APPROVED').length} / {permit.approvals?.length} Signed
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {permit.approvals?.map((app: any) => {
                const isApproved = app.status === 'APPROVED';
                const isRejected = app.status === 'REJECTED';
                const roleLabel = (app.roleRequired || app.role || '').replace('_', ' ');

                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-2xl border-2 space-y-3 ${
                      isApproved
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : isRejected
                        ? 'border-red-300 bg-red-50/40'
                        : 'border-amber-300 bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        {roleLabel}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-600 text-white'
                            : isRejected
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-400 block font-medium">Designated Approver</span>
                      <span className="font-bold text-slate-900">{app.approver?.name || 'Awaiting Assignment'}</span>
                      {app.signedAt && (
                        <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                          Signed on {new Date(app.signedAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Canvas Signature Preview */}
                    {app.signatureData ? (
                      <div className="p-2 rounded-xl bg-white border border-slate-200">
                        <img
                          src={app.signatureData}
                          alt="Digital Signature"
                          className="h-14 w-auto mx-auto object-contain"
                        />
                        <span className="text-[9px] text-center text-slate-400 block font-mono">
                          Cryptographically Certified Signature
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs italic">
                        Signature pending authorization
                      </div>
                    )}

                    {app.comments && (
                      <p className="text-[11px] text-slate-600 italic bg-white/70 p-2 rounded-lg border border-slate-200">
                        "{app.comments}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: CHRONOLOGICAL IMMUTABLE AUDIT TIMELINE (32%) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Immutable Audit Log
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {permit.auditLogs?.length || 0} Events
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Every state transition, extension, approval, and suspension is recorded with strict timestamps, user identity, and cryptographic immutability.
            </p>

            {/* Vertical Chronological Timeline */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {permit.auditLogs?.map((log: any, idx: number) => {
                const isLatest = idx === 0;

                return (
                  <div key={log.id} className="relative group text-xs">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                        isLatest ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-slate-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 uppercase text-[11px]">
                          {log.action}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        by <strong className="text-slate-800">{log.performedBy?.name || 'System Operator'}</strong>{' '}
                        <span className="text-[10px] text-slate-400">({log.performedBy?.role})</span>
                      </div>

                      {log.comment && (
                        <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200/80 mt-1">
                          "{log.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Pad Modal */}
      <SignaturePadModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        roleLabel={currentUser?.role === 'AREA_OWNER' ? 'Area Owner Approval' : 'Safety Officer Approval'}
        permitNumber={permit.permitNumber}
        onConfirm={async (signatureData, comments) => {
          await handleTransition('APPROVE', { signatureData, comment: comments });
        }}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        permitNumber={permit.permitNumber}
        onConfirm={async (reason) => {
          await handleTransition('REJECT', { reason });
        }}
      />

      {/* Suspend Modal */}
      <SuspendModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        permitNumber={permit.permitNumber}
        onConfirm={async (reason) => {
          await handleTransition('SUSPEND', { reason });
        }}
      />

      {/* Extend Modal */}
      <ExtendModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        permitNumber={permit.permitNumber}
        onConfirm={async (hours, reason) => {
          await handleExtend(hours, reason);
        }}
      />

      {/* Field QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        permitId={permit.id}
        permitNumber={permit.permitNumber}
      />
    </main>
  );
}
