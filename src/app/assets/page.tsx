'use client';

import React, { useState } from 'react';
import { TopHeader } from '@/frontend/components/TopHeader';
import { 
  Building2, 
  Layers, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle, 
  Search, 
  Activity, 
  Cpu, 
  Zap, 
  Gauge,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<'ALL' | 'AP-CHN-01' | 'PF-SRP-02'>('ALL');

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
      hazard: 'HOT_WORK',
      lastInspection: 'Nov 18, 2026',
      assignedTech: 'Kavitha Requester',
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
      hazard: 'HOT_WORK',
      lastInspection: 'Nov 21, 2026',
      assignedTech: 'Kavitha Requester',
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
      hazard: 'CHEMICAL_HANDLING',
      lastInspection: 'Nov 12, 2026',
      assignedTech: 'External Contractor',
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
      hazard: 'CONFINED_SPACE',
      lastInspection: 'Nov 24, 2026',
      assignedTech: 'Preventive Crew',
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
      hazard: 'ELECTRICAL_LOTO',
      lastInspection: 'Nov 15, 2026',
      assignedTech: 'Substation Lead',
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
      hazard: 'WORKING_AT_HEIGHT',
      lastInspection: 'Nov 22, 2026',
      assignedTech: 'Rigging Team',
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.areaName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlant = selectedPlant === 'ALL' || asset.plantCode === selectedPlant;
    return matchesSearch && matchesPlant;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70">
      <TopHeader pageTitle="Plant Topology & Asset Register" />

      <main className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Plant Topology & Equipment Asset Register
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-2xs">
                CMMS Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Statutory asset catalog, operational health scoring, and active Permit to Work (PTW) maintenance lockouts.
            </p>
          </div>

          <Link
            href="/permits/new"
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Issue Safety Permit</span>
          </Link>
        </div>

        {/* 4 Plant KPI Metric Banners */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plants</span>
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">2 Plants</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Chennai & Sriperumbudur</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hazard Zones</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">5 Areas</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Boilers, Substation, Paint</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CMMS Assets</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Cpu className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">6 Assets</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Monitored high-hazard</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Lockouts</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">5 Live Permits</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Zero safety breaches</span>
          </div>
        </div>

        {/* Search & Plant Filter Tabs */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search equipment by Tag # (EQ-BLR-01), name, or area zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/50 hover:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Plant:
            </span>
            <button
              onClick={() => setSelectedPlant('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedPlant === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Plants (6 eq)
            </button>
            <button
              onClick={() => setSelectedPlant('AP-CHN-01')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedPlant === 'AP-CHN-01'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Chennai Assembly (3)
            </button>
            <button
              onClick={() => setSelectedPlant('PF-SRP-02')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedPlant === 'PF-SRP-02'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Sriperumbudur (3)
            </button>
          </div>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200 group-hover:border-amber-400 transition-colors">
                        {asset.tag}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        asset.criticality === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {asset.criticality}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {asset.name}
                    </h3>
                  </div>

                  {/* Health gauge */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">HEALTH SCORE</span>
                    <span className="font-mono font-black text-sm text-emerald-600">{asset.healthScore}%</span>
                  </div>
                </div>

                {/* Location meta */}
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">{asset.areaName}</span>
                  <span className="text-slate-300">•</span>
                  <span>{asset.plantName}</span>
                </div>

                {/* Technical Specs box */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-600 leading-relaxed">
                  {asset.specs}
                </div>
              </div>

              {/* Bottom footer row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      asset.activePermits > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`} />
                    <span className="font-bold text-slate-800">
                      {asset.activePermits > 0 ? `${asset.activePermits} Live Permits` : 'Available'}
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-medium">Inspected: {asset.lastInspection}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/?search=${encodeURIComponent(asset.name)}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    View Permits
                  </Link>
                  <Link
                    href="/permits/new"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-2xs flex items-center gap-1"
                  >
                    <span>Issue PTW</span>
                    <ArrowRight className="w-3 h-3 stroke-[3]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
