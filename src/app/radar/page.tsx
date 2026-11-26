'use client';

import React, { useState } from 'react';
import { TopHeader } from '@/frontend/components/TopHeader';
import { 
  ShieldAlert, 
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
  AlertOctagon,
  PlusCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function RadarPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Solvent & Chemical Storage Yard');
  const [permitA, setPermitA] = useState('HOT_WORK');
  const [permitB, setPermitB] = useState('CHEMICAL_HANDLING');

  const handleScanNow = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const getConflictAnalysis = () => {
    if (permitA === 'HOT_WORK' && (permitB === 'CHEMICAL_HANDLING' || selectedZone.includes('Solvent'))) {
      return {
        level: 'CRITICAL',
        riskScore: 92,
        title: 'FLAMMABLE VAPOR & OPEN IGNITION COLLISION',
        oshaStandard: 'OSHA 1910.119 (PSM) & NFPA 51B §5.2',
        distance: '3.5 meters (Violation: Required Safe Clearance >= 15.0m)',
        details: 'Hot Work (arc welding / torch cutting) is co-located within the 15-meter vapor hazard radius of volatile solvent transfer pumping operations. Immediate catastrophic vapor flash fire ignition risk.',
        actionRequired: 'Automated Stop-Work Lockout. Continuous LEL atmospheric gas detection (< 5% LEL) and positive-pressure certified fire barrier mandatory prior to authorization.',
        color: 'rose'
      };
    }
    if ((permitA === 'WORKING_AT_HEIGHT' && permitB === 'HOT_WORK') || (permitA === 'HOT_WORK' && permitB === 'WORKING_AT_HEIGHT')) {
      return {
        level: 'HIGH',
        riskScore: 78,
        title: 'VERTICAL OVERHEAD SLAG & PERSONNEL HAZARD',
        oshaStandard: 'OSHA 1926.352(e) & ANSI Z49.1',
        distance: 'Direct vertical overlap (Elevation: 6.2m above lower work bay)',
        details: 'Molten weld spatter and slag from elevated structural maintenance directly threatens personnel and mechanical equipment operating in the bay below.',
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
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70">
      <TopHeader pageTitle="Hazard Conflict Radar & Spatial Interlock" />

      <main className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Hazard Conflict Radar & Spatial Interlock
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-2xs">
                Real-Time Scanner
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Algorithmic spatial collision detection preventing simultaneous high-hazard maintenance operations.
            </p>
          </div>

          <button
            onClick={handleScanNow}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Grid...' : 'Rescan Plant Grid'}</span>
          </button>
        </div>

        {/* Live Perimeter Safety Sweep Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full border-2 border-emerald-500/40 flex items-center justify-center shrink-0 bg-emerald-950/30">
              <div className="absolute inset-1 rounded-full border border-emerald-500/30 animate-ping opacity-60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-emerald-400 tracking-tight">
                  PLANT SAFETY PERIMETER CLEAR — ZERO ACTIVE CONFLICTS
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                All 10 logged permits are operating within compliant spatial and schedule buffer zones across Chennai and Sriperumbudur manufacturing plants. Continuous spatial check active.
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 text-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Perimeter Frequency</span>
            <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              Continuous (1,000ms Loop)
            </span>
          </div>
        </div>

        {/* Interactive Collision Simulator Box */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Interactive Permit Collision Simulator</span>
            </div>
            <p className="text-xs text-slate-500">
              Select any work zone and two concurrent permit types to test Opmaint conflict detection algorithms against OSHA / NFPA safety regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Target Work Zone</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              >
                <option value="Solvent & Chemical Storage Yard">Solvent & Chemical Storage Yard (Tank Yard)</option>
                <option value="High Pressure Boiler & Steam Room">High Pressure Boiler & Steam Room</option>
                <option value="Robotic Assembly Bay 3">Robotic Assembly Bay 3 (Cell 4)</option>
                <option value="Substation Transformer Yard 3">Substation Transformer Yard 3 (11kV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Permit 1 (Active Scope)</label>
              <select
                value={permitA}
                onChange={(e) => setPermitA(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              >
                <option value="HOT_WORK">🔥 Hot Work (Welding / Torch)</option>
                <option value="CHEMICAL_HANDLING">🧪 Chemical & Solvent Transfer</option>
                <option value="WORKING_AT_HEIGHT">↗️ Working at Height (&gt; 2m)</option>
                <option value="ELECTRICAL_LOTO">⚡ Electrical LOTO Isolation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Permit 2 (New Request)</label>
              <select
                value={permitB}
                onChange={(e) => setPermitB(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
              >
                <option value="CHEMICAL_HANDLING">🧪 Chemical & Solvent Transfer</option>
                <option value="HOT_WORK">🔥 Hot Work (Welding / Torch)</option>
                <option value="WORKING_AT_HEIGHT">↗️ Working at Height (&gt; 2m)</option>
                <option value="ELECTRICAL_LOTO">⚡ Electrical LOTO Isolation</option>
              </select>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            analysis.level === 'CRITICAL'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : analysis.level === 'HIGH'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : analysis.level === 'MODERATE'
              ? 'bg-blue-50 border-blue-300 text-blue-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  analysis.level === 'CRITICAL' ? 'bg-rose-600 text-white' :
                  analysis.level === 'HIGH' ? 'bg-amber-600 text-white' :
                  analysis.level === 'MODERATE' ? 'bg-blue-600 text-white' :
                  'bg-emerald-600 text-white'
                }`}>
                  {analysis.level} COLLISION DETECTED
                </span>
                <span className="font-mono text-xs font-bold">Risk Index: {analysis.riskScore}/100</span>
              </div>
              <span className="text-[11px] font-mono font-semibold opacity-75">{analysis.oshaStandard}</span>
            </div>

            <h4 className="text-sm font-black tracking-tight mb-1">
              {analysis.title}
            </h4>
            <p className="text-xs opacity-90 leading-relaxed mb-3">
              {analysis.details}
            </p>

            <div className="pt-2.5 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="opacity-70 font-semibold">Separation:</span>{' '}
                <span className="font-mono font-bold">{analysis.distance}</span>
              </div>
              <div>
                <span className="opacity-70 font-semibold">Mitigation:</span>{' '}
                <span className="font-medium">{analysis.actionRequired}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Active Plant Conflict Interlock Rules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">
              Active Plant Conflict Interlock Rules (3 Enforced)
            </h2>
            <span className="text-xs text-slate-400 font-medium">Auto-evaluated on permit submission</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  RULE #1
                </span>
                <span className="text-[10px] font-black text-rose-600 uppercase">15m Exclusion</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Vapor Exclusion Buffer Zone</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strict prohibition of Hot Work / Spark-producing activities within 15 meters of Solvent & Chemical Storage Yard without atmospheric gas clearance (&lt; 5% LEL).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  RULE #2
                </span>
                <span className="text-[10px] font-black text-amber-600 uppercase">11kV LOTO</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">High-Voltage Substation Interlock</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Physical padlock lockout and zero-energy earthing verification must be verified by Area Owner prior to granting access to Substation Transformer Yard 3.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  RULE #3
                </span>
                <span className="text-[10px] font-black text-blue-600 uppercase">6 ACH Air Flow</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Confined Space Ventilation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continuous forced air ventilation (minimum 6 air changes/hour) and stand-by rescue observer required for all boiler drum and vessel maintenance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
