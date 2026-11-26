'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Layers, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Activity,
  Cpu,
  Zap,
  Gauge
} from 'lucide-react';
import Link from 'next/link';

interface PlantAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment?: (equipmentName: string) => void;
}

export const PlantAssetsModal: React.FC<PlantAssetsModalProps> = ({
  isOpen,
  onClose,
  onSelectEquipment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlantFilter, setSelectedPlantFilter] = useState<'ALL' | 'AP-CHN-01' | 'PF-SRP-02'>('ALL');

  if (!isOpen) return null;

  const assets = [
    {
      id: 'eq-1',
      tag: 'EQ-BLR-01',
      name: 'High-Pressure Steam Boiler Unit 1',
      plantCode: 'AP-CHN-01',
      plantName: 'Chennai Automotive Assembly Plant',
      areaName: 'High Pressure Boiler & Steam Room',
      criticality: 'CRITICAL',
      status: 'UNDER_MAINTENANCE',
      healthScore: 78,
      activePermits: 2,
      specs: 'Max Pressure: 42 Bar | Operational Temp: 450°C | Dual Safety Relief Valves',
      lastInspection: 'Nov 18, 2026',
    },
    {
      id: 'eq-2',
      tag: 'EQ-ROB-06',
      name: 'Robotic Spot Welding Cell 4',
      plantCode: 'PF-SRP-02',
      plantName: 'Sriperumbudur Metal Stamping & Paint Facility',
      areaName: 'Robotic Assembly Bay 3',
      criticality: 'HIGH',
      status: 'PERMIT_ACTIVE',
      healthScore: 84,
      activePermits: 1,
      specs: '400V 3-Phase | 6-Axis Heavy Duty Articulated Arm | Optical Light Curtains',
      lastInspection: 'Nov 21, 2026',
    },
    {
      id: 'eq-3',
      tag: 'EQ-PMP-02',
      name: 'Flammable Solvent Transfer Pump 2',
      plantCode: 'AP-CHN-01',
      plantName: 'Chennai Automotive Assembly Plant',
      areaName: 'Solvent & Chemical Storage Yard',
      criticality: 'HIGH',
      status: 'STANDBY',
      healthScore: 92,
      activePermits: 1,
      specs: 'Explosion-Proof Motor Ex d IIC T4 | 250 L/min Flow | Viton Chemical Seals',
      lastInspection: 'Nov 12, 2026',
    },
    {
      id: 'eq-4',
      tag: 'EQ-PNT-03',
      name: 'Electrostatic Spray Booth Line B',
      plantCode: 'PF-SRP-02',
      plantName: 'Sriperumbudur Metal Stamping & Paint Facility',
      areaName: 'Paint Shop Booth 2',
      criticality: 'MEDIUM',
      status: 'OPERATIONAL',
      healthScore: 96,
      activePermits: 0,
      specs: 'Class 1 Div 1 Downdraft Air Filtration | VOC Exhaust Gas Recovery System',
      lastInspection: 'Nov 24, 2026',
    },
    {
      id: 'eq-5',
      tag: 'EQ-TRF-01',
      name: 'Main HT Step-Down Transformer 11kV',
      plantCode: 'AP-CHN-01',
      plantName: 'Chennai Automotive Assembly Plant',
      areaName: 'Substation Transformer Yard 3',
      criticality: 'CRITICAL',
      status: 'LOTO_REQUIRED',
      healthScore: 71,
      activePermits: 1,
      specs: '11kV to 415V 2500kVA | Oil ONAN Insulated | Buchholz Surge Relay Protected',
      lastInspection: 'Nov 15, 2026',
    },
    {
      id: 'eq-6',
      tag: 'EQ-CRN-05',
      name: 'Overhead Gantry Crane 15T',
      plantCode: 'PF-SRP-02',
      plantName: 'Sriperumbudur Metal Stamping & Paint Facility',
      areaName: 'Robotic Assembly Bay 3',
      criticality: 'MEDIUM',
      status: 'OPERATIONAL',
      healthScore: 94,
      activePermits: 0,
      specs: '24m Crane Span | Safe Working Load: 15 Tonnes | Dual Hoist Wire Ropes',
      lastInspection: 'Nov 22, 2026',
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.areaName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlant =
      selectedPlantFilter === 'ALL' || asset.plantCode === selectedPlantFilter;
    return matchesSearch && matchesPlant;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-tight">Plant Topology & Equipment Asset Register</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  CMMS Verified (6 Assets)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical plant assets, criticality ratings, and real-time maintenance authorizations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by equipment tag, name, or zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold mr-1">Plant Filter:</span>
            <button
              onClick={() => setSelectedPlantFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                selectedPlantFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setSelectedPlantFilter('AP-CHN-01')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                selectedPlantFilter === 'AP-CHN-01'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Chennai (3)
            </button>
            <button
              onClick={() => setSelectedPlantFilter('PF-SRP-02')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                selectedPlantFilter === 'PF-SRP-02'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sriperumbudur (3)
            </button>
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {asset.tag}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate">
                    {asset.name}
                  </h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    asset.criticality === 'CRITICAL'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {asset.criticality}
                  </span>
                </div>

                <div className="text-slate-400 text-xs flex items-center gap-2">
                  <span className="text-slate-300 font-medium">{asset.areaName}</span>
                  <span className="text-slate-600">•</span>
                  <span>{asset.plantName}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800/80 inline-block">
                  {asset.specs}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block">HEALTH SCORE</span>
                    <span className="font-mono font-bold text-xs text-emerald-400">{asset.healthScore}%</span>
                  </div>
                  <div className="w-px h-6 bg-slate-800" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      asset.activePermits > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-bold text-slate-300">
                      {asset.activePermits > 0 ? `${asset.activePermits} Live PTW` : 'Zero Lockouts'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onSelectEquipment && (
                    <button
                      onClick={() => {
                        onSelectEquipment(asset.name);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-xs"
                    >
                      Filter Table
                    </button>
                  )}
                  <Link
                    href="/permits/new"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-500/10 flex items-center gap-1"
                  >
                    <span>Issue PTW</span>
                    <ArrowRight className="w-3 h-3 stroke-[3]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Opmaint Plant Topology Engine • Active CMMS Sync</span>
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
