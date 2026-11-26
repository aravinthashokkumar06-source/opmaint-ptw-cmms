'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Box, 
  ArrowRight,
  RefreshCw,
  Search,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import Link from 'next/link';

interface HazardRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HazardRadarModal: React.FC<HazardRadarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Solvent & Chemical Storage Yard');
  const [permitA, setPermitA] = useState('HOT_WORK');
  const [permitB, setPermitB] = useState('CHEMICAL_HANDLING');
  const [hasSimulated, setHasSimulated] = useState(false);

  if (!isOpen) return null;

  const handleScanNow = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 900);
  };

  const getConflictAnalysis = () => {
    if (permitA === 'HOT_WORK' && (permitB === 'CHEMICAL_HANDLING' || selectedZone.includes('Solvent'))) {
      return {
        level: 'CRITICAL',
        riskScore: 92,
        title: 'FLAMMABLE VAPOR & IGNITION SOURCE COLLISION',
        oshaStandard: 'OSHA 1910.119 (PSM) & NFPA 51B §5.2',
        distance: '3.5 meters (Violation: Safe Buffer >= 15.0m)',
        details: 'Hot Work (open flame / arc welding) is co-located within the 15-meter vapor hazard radius of volatile solvent transfer pumping operations. Immediate catastrophic vapor ignition risk.',
        actionRequired: 'Automated Stop-Work Lockout. Continuous LEL gas detection (< 5% LEL) and positive-pressure certified fire barrier mandatory prior to approval.',
        color: 'rose'
      };
    }
    if ((permitA === 'WORKING_AT_HEIGHT' && permitB === 'HOT_WORK') || (permitA === 'HOT_WORK' && permitB === 'WORKING_AT_HEIGHT')) {
      return {
        level: 'HIGH',
        riskScore: 78,
        title: 'VERTICAL OVERHEAD SLAG & PERSONNEL HAZARD',
        oshaStandard: 'OSHA 1926.352(e) & ANSI Z49.1',
        distance: 'Direct vertical overlap (Height: 6.2m above lower work bay)',
        details: 'Molten weld spatter and slag from elevated maintenance directly threatens personnel and mechanical equipment operating in the bay below.',
        actionRequired: 'Certified fireproof spark-catchment tarpaulin and 100% physical drop-zone barricading required.',
        color: 'amber'
      };
    }
    if (permitA === 'ELECTRICAL_LOTO' && permitB === 'ELECTRICAL_LOTO') {
      return {
        level: 'MODERATE',
        riskScore: 45,
        title: 'COORDINATED ENERGY ISOLATION (GROUP LOTO REQUIRED)',
        oshaStandard: 'OSHA 1910.147(f)(3) Group Lockout',
        distance: 'Shared electrical distribution panel busbar',
        details: 'Multiple maintenance teams working on the same feeder. Individual locks alone are insufficient.',
        actionRequired: 'Master Group Lockout Box, individual safety padlocks per technician, and verification by Area Owner required.',
        color: 'blue'
      };
    }
    return {
      level: 'SAFE',
      riskScore: 12,
      title: 'SPATIAL COMPLIANCE VERIFIED — NO DETECTED COLLISION',
      oshaStandard: 'Compliant with Plant EHS Guideline §14',
      distance: 'Spatial separation > 25.0 meters with separate ventilation circuits',
      details: 'Work scopes are sufficiently isolated. No atmospheric, thermal, or electrical cross-contamination detected.',
      actionRequired: 'Standard personal protective equipment (PPE) and scheduled area supervisor sign-off.',
      color: 'emerald'
    };
  };

  const analysis = getConflictAnalysis();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-tight">Hazard Conflict Radar & Spatial Interlock</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live Algorithmic Protection
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simultaneous work authorization collision detection engine across plant coordinates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleScanNow}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Sweeping Grid...' : 'Rescan Radar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Real-time Status Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Radar Graphic */}
              <div className="relative w-16 h-16 rounded-full border-2 border-emerald-500/30 flex items-center justify-center shrink-0 bg-emerald-950/30">
                <div className="absolute inset-2 rounded-full border border-emerald-500/20 animate-ping opacity-60" />
                <div className="absolute inset-4 rounded-full border border-emerald-500/40" />
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-emerald-400 uppercase tracking-tight">
                    Plant Safety Perimeter Clear
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                  All 10 active permits are spatially segregated. No co-location collisions or overlapping high-hazard hot work permits are currently in violation.
                </p>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Perimeter Sweep</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Live (1,000ms Loop)
              </span>
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Interactive Hazard Collision Simulator</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Select two hazardous work scopes in the same work area to test Opmaint conflict interlock logic.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Zone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Facility Zone</label>
                <div className="relative">
                  <select
                    value={selectedZone}
                    onChange={(e) => {
                      setSelectedZone(e.target.value);
                      setHasSimulated(true);
                    }}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Solvent & Chemical Storage Yard">Solvent & Chemical Storage Yard (Tank Yard)</option>
                    <option value="High Pressure Boiler & Steam Room">High Pressure Boiler & Steam Room</option>
                    <option value="Robotic Assembly Bay 3">Robotic Assembly Bay 3 (Cell 4)</option>
                    <option value="Substation Transformer Yard 3">Substation Transformer Yard 3 (11kV)</option>
                  </select>
                </div>
              </div>

              {/* Permit 1 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Permit 1 (Active Scope)</label>
                <div className="relative">
                  <select
                    value={permitA}
                    onChange={(e) => {
                      setPermitA(e.target.value);
                      setHasSimulated(true);
                    }}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="HOT_WORK">🔥 Hot Work (Welding / Cutting)</option>
                    <option value="CHEMICAL_HANDLING">🧪 Chemical & Solvent Transfer</option>
                    <option value="WORKING_AT_HEIGHT">↗️ Working at Height (&gt; 2m)</option>
                    <option value="ELECTRICAL_LOTO">⚡ Electrical LOTO Isolation</option>
                  </select>
                </div>
              </div>

              {/* Permit 2 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Permit 2 (New Request)</label>
                <div className="relative">
                  <select
                    value={permitB}
                    onChange={(e) => {
                      setPermitB(e.target.value);
                      setHasSimulated(true);
                    }}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="CHEMICAL_HANDLING">🧪 Chemical & Solvent Transfer</option>
                    <option value="HOT_WORK">🔥 Hot Work (Welding / Cutting)</option>
                    <option value="WORKING_AT_HEIGHT">↗️ Working at Height (&gt; 2m)</option>
                    <option value="ELECTRICAL_LOTO">⚡ Electrical LOTO Isolation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Analysis Result Card */}
            <div className={`p-4 rounded-xl border transition-all ${
              analysis.level === 'CRITICAL'
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : analysis.level === 'HIGH'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : analysis.level === 'MODERATE'
                ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    analysis.level === 'CRITICAL' ? 'bg-rose-600 text-white' :
                    analysis.level === 'HIGH' ? 'bg-amber-600 text-white' :
                    analysis.level === 'MODERATE' ? 'bg-blue-600 text-white' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {analysis.level} COLLISION RISK
                  </span>
                  <span className="font-mono text-xs font-bold text-white">Risk Index: {analysis.riskScore}/100</span>
                </div>
                <span className="text-[11px] font-mono opacity-80">{analysis.oshaStandard}</span>
              </div>

              <h4 className="text-xs font-black tracking-tight text-white mb-1">
                {analysis.title}
              </h4>
              <p className="text-[11px] opacity-90 leading-relaxed mb-2">
                {analysis.details}
              </p>

              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div>
                  <span className="opacity-70 font-semibold">Separation:</span>{' '}
                  <span className="font-mono font-bold text-white">{analysis.distance}</span>
                </div>
                <div>
                  <span className="opacity-70 font-semibold">Mitigation:</span>{' '}
                  <span className="font-medium text-white">{analysis.actionRequired}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Statutory Safety Rules */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Enforced Plant Statutory Safety Matrix (3 Rules Active)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">RULE #1</span>
                  <span className="text-[10px] font-black text-rose-400 uppercase">15m Safe Zone</span>
                </div>
                <h5 className="font-bold text-white text-xs">Vapor Exclusion Radius</h5>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Strict prohibition of Hot Work within 15 meters of flammable solvent transfer pumps without certified nitrogen purge.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">RULE #2</span>
                  <span className="text-[10px] font-black text-amber-400 uppercase">11kV Isolation</span>
                </div>
                <h5 className="font-bold text-white text-xs">High Voltage Interlock</h5>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Physical padlock lockout and zero-energy earthing verification required before permits in Substation Bay 3 are released.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">RULE #3</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase">6 ACH Air Flow</span>
                </div>
                <h5 className="font-bold text-white text-xs">Confined Space Air Changes</h5>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Continuous forced air exhaust ventilation and stand-by rescue observer required for boiler vessel inspections.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Opmaint Collision Engine v2.4 • Compliant with NFPA & OSHA Guidelines</span>
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
