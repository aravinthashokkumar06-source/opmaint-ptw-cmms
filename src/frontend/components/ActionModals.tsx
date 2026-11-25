'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  QrCode, 
  AlertOctagon,
  Copy,
  Check
} from 'lucide-react';

// ============================================================================
// 1. REJECT MODAL
// ============================================================================
interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  permitNumber: string;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  permitNumber,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('A mandatory rejection reason must be documented for safety compliance.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onConfirm(reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reject permit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm">
            <AlertOctagon className="w-5 h-5" />
            <span>Reject Permit to Work</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-600">
          Rejecting permit <strong className="text-slate-900">{permitNumber}</strong> is a permanent terminal action. The requester will be notified to revise their safety plan.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mandatory Rejection Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Scaffolding has no intermediate landing; lack of secondary fire watch personnel; atmospheric LEL exceeds allowable 1% limit."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20 disabled:opacity-50"
          >
            {loading ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. EMERGENCY SUSPENSION MODAL
// ============================================================================
interface SuspendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  permitNumber: string;
}

export const SuspendModal: React.FC<SuspendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  permitNumber,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide the observed safety violation or hazardous condition.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onConfirm(reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to suspend permit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-red-500 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600 font-black text-sm">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>Emergency Site Stop Work Order</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 leading-relaxed font-medium">
          ⚠️ <strong>Immediate Cease & Desist:</strong> Suspending permit <strong>{permitNumber}</strong> revokes on-site authorization immediately. Workers must de-energize tools and evacuate the work area.
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Observed Hazardous Violation / Stop-Work Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Flammable solvent spilled in adjacent line; sudden gas alarm trigger; fire watch left post unattended."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-md shadow-red-600/30 disabled:opacity-50"
          >
            {loading ? 'Issuing Stop Order...' : 'Issue Stop Work Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. VALIDITY EXTENSION MODAL (+N hours)
// ============================================================================
interface ExtendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hours: number, reason: string) => Promise<void>;
  permitNumber: string;
}

export const ExtendModal: React.FC<ExtendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  permitNumber,
}) => {
  const [hours, setHours] = useState(2);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a justification for requesting the extension.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onConfirm(hours, reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to extend permit validity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
            <Clock className="w-5 h-5" />
            <span>Request Validity Extension</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-600">
          Request additional hours for <strong className="text-slate-900">{permitNumber}</strong> before the current validity window expires.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Extension Duration (Hours)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 4, 8].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHours(h)}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold border-2 transition-all ${
                  hours === h
                    ? 'border-amber-500 bg-amber-500/10 text-amber-950'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                +{h}h
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Operational Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Unforeseen structural misalignment requires 2 additional hours of welding and non-destructive dye penetrant inspection."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? 'Extending...' : `Extend Validity +${hours} Hours`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. FIELD QR CODE VERIFICATION MODAL
// ============================================================================
interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  permitId: string;
  permitNumber: string;
}

export const QrCodeModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  permitId,
  permitNumber,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!isOpen) return;
    async function loadQr() {
      try {
        setLoading(true);
        const res = await fetch(`/api/permits/${permitId}/qrcode`);
        const data = await res.json();
        if (data.qrCode) {
          setQrCodeUrl(data.qrCode);
        }
      } catch (err) {
        console.error('Failed to load QR code', err);
      } finally {
        setLoading(false);
      }
    }
    loadQr();
  }, [isOpen, permitId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <QrCode className="w-5 h-5 text-amber-500" />
            <span>Field Walk-around Verification</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block mx-auto">
          {loading ? (
            <div className="w-48 h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : qrCodeUrl ? (
            <img src={qrCodeUrl} alt="Permit QR Code" className="w-48 h-48 rounded-xl shadow-xs" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
              Unable to generate QR code.
            </div>
          )}
        </div>

        <div>
          <span className="font-mono font-extrabold text-sm text-slate-900 block">
            {permitNumber}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Safety officers and auditors on the plant floor can scan this QR code with any mobile device to verify real-time permit validity, active controls, and digital signature authorization.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Close QR Window
          </button>
        </div>
      </div>
    </div>
  );
};
