'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ConflictBanner, ConflictingPermit } from './ConflictBanner';
import { TypeSpecificFields } from './TypeSpecificFields';
import { 
  Flame, 
  Box, 
  ArrowUpRight, 
  Zap, 
  FlaskConical, 
  Snowflake, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Save, 
  Send,
  Building2,
  HardHat,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  Clock,
  Sparkles,
  FileCheck2,
  Info
} from 'lucide-react';

interface Plant {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
  plantId: string;
}

interface Equipment {
  id: string;
  name: string;
  tag: string;
  areaId: string;
}

export const CreatePermitForm: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Wizard Step: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState(1);

  // Metadata dropdowns
  const [plants, setPlants] = useState<Plant[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Step 1: Core Details
  const [title, setTitle] = useState('');
  const [type, setType] = useState('HOT_WORK');
  const [workDescription, setWorkDescription] = useState('');
  const [contractorName, setContractorName] = useState('Delta Industrial Maintenance');
  const [plantId, setPlantId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');

  // Default times: start in 1 hour, end in 5 hours
  const now = new Date();
  const defaultStart = new Date(now.getTime() + 1 * 3600 * 1000).toISOString().slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 6 * 3600 * 1000).toISOString().slice(0, 16);

  const [plannedStartTime, setPlannedStartTime] = useState(defaultStart);
  const [plannedEndTime, setPlannedEndTime] = useState(defaultEnd);

  // Step 2: Hazards & PPE Checklists
  const [hazards, setHazards] = useState<string[]>([
    'Open Flame / Sparks',
    'Combustible Dust',
    'High Heat',
  ]);
  const [ppe, setPpe] = useState<string[]>([
    'Safety Goggles',
    'Flame Retardant Coverall',
    'Leather Welding Gloves',
    'Steel-Toe Safety Boots',
  ]);
  const [precautions, setPrecautions] = useState([
    { item: 'Combustibles cleared within 10-meter radius', checked: true },
    { item: 'Fire extinguisher inspected and positioned within arm reach', checked: true },
    { item: 'Designated Fire Watch assigned with audible emergency horn', checked: true },
    { item: 'Atmospheric gas testing completed (0% LEL, 20.9% O2)', checked: true },
  ]);

  // Step 3: Type Specific Data
  const [typeData, setTypeData] = useState<Record<string, any>>({
    hotWorkType: 'welding',
    fireWatchAssigned: 'Vignesh Kumar',
    fireExtinguisherType: 'CO2 5kg + DCP 9kg',
    combustiblesClearedRadiusMeters: 10,
    gasTestReadings: {
      lelPercent: 0,
      o2Percent: 20.9,
      testedBy: 'Murugan Technician',
      testTime: defaultStart,
    },
  });

  // Step 4: Real-time Conflicts
  const [conflicts, setConflicts] = useState<ConflictingPermit[]>([]);
  const [checkingConflicts, setCheckingConflicts] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch Metadata on mount
  useEffect(() => {
    async function loadMetadata() {
      try {
        const res = await fetch('/api/metadata');
        const data = await res.json();
        if (data.plants) setPlants(data.plants);
        if (data.areas) setAreas(data.areas);
        if (data.equipment) setEquipmentList(data.equipment);

        if (data.plants && data.plants.length > 0) {
          setPlantId(data.plants[0].id);
        }
      } catch (err) {
        console.error('Failed to load metadata', err);
      } finally {
        setLoadingMetadata(false);
      }
    }
    loadMetadata();
  }, []);

  // Filtered dropdowns:
  const filteredAreas = areas.filter((a) => a.plantId === plantId);
  const filteredEquipment = equipmentList.filter((e) => e.areaId === areaId);

  // Auto-select first area when plant changes
  useEffect(() => {
    if (filteredAreas.length > 0 && !filteredAreas.some((a) => a.id === areaId)) {
      setAreaId(filteredAreas[0].id);
    }
  }, [plantId, filteredAreas, areaId]);

  // Auto-select first equipment when area changes
  useEffect(() => {
    if (filteredEquipment.length > 0 && !filteredEquipment.some((e) => e.id === equipmentId)) {
      setEquipmentId(filteredEquipment[0].id);
    }
  }, [areaId, filteredEquipment, equipmentId]);

  // Live conflict detection checker
  useEffect(() => {
    async function checkConflicts() {
      if (!areaId || !type || !plannedStartTime || !plannedEndTime) return;
      try {
        setCheckingConflicts(true);
        const res = await fetch('/api/permits/check-conflicts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            areaId,
            plannedStartTime,
            plannedEndTime,
          }),
        });
        const data = await res.json();
        if (data.hasConflict) {
          setConflicts(data.conflictingPermits || []);
        } else {
          setConflicts([]);
        }
      } catch (err) {
        console.error('Failed to check conflicts', err);
      } finally {
        setCheckingConflicts(false);
      }
    }
    checkConflicts();
  }, [type, areaId, plannedStartTime, plannedEndTime]);

  // Toggle helpers
  const toggleHazard = (hazard: string) => {
    setHazards((prev) =>
      prev.includes(hazard) ? prev.filter((h) => h !== hazard) : [...prev, hazard]
    );
  };

  const togglePpe = (item: string) => {
    setPpe((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const togglePrecaution = (index: number) => {
    setPrecautions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, checked: !p.checked } : p))
    );
  };

  // Submit Handler
  const handleSubmit = async (isDraft: boolean) => {
    try {
      setFormError(null);
      setSubmitting(true);

      if (!title.trim()) {
        setFormError('Please enter a clear permit title.');
        setSubmitting(false);
        return;
      }

      if (!workDescription.trim()) {
        setFormError('Please provide a detailed maintenance work description.');
        setSubmitting(false);
        return;
      }

      if (!plantId || !areaId || !equipmentId) {
        setFormError('Please select Plant, Area, and Target Equipment.');
        setSubmitting(false);
        return;
      }

      const payload = {
        title,
        workDescription,
        type,
        contractorName,
        plantId,
        areaId,
        equipmentId,
        plannedStartTime,
        plannedEndTime,
        hazardsIdentified: hazards,
        ppeRequired: ppe,
        precautionsChecklist: precautions,
        typeSpecificData: typeData,
        isDraft,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }

      const res = await fetch('/api/permits', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create permit.');
      }

      // Navigate to dashboard or permit details
      router.push(`/permits/${data.permit.id}`);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Error creating safety permit.');
    } finally {
      setSubmitting(false);
    }
  };

  const permitTypes = [
    { 
      id: 'HOT_WORK', 
      label: 'Hot Work', 
      desc: 'Welding, torch cutting, sparks & open flames', 
      icon: Flame, 
      accentColor: 'orange',
      bgSelected: 'bg-orange-50/90 border-orange-500 text-orange-950 ring-2 ring-orange-500/20',
      badgeColor: 'bg-orange-600 text-white'
    },
    { 
      id: 'CONFINED_SPACE', 
      label: 'Confined Space', 
      desc: 'Tanks, boilers, pits & low-oxygen vessels', 
      icon: Box, 
      accentColor: 'purple',
      bgSelected: 'bg-purple-50/90 border-purple-500 text-purple-950 ring-2 ring-purple-500/20',
      badgeColor: 'bg-purple-600 text-white'
    },
    { 
      id: 'WORKING_AT_HEIGHT', 
      label: 'Height Work', 
      desc: 'Work > 2m, scaffolding, ladders & boom lifts', 
      icon: ArrowUpRight, 
      accentColor: 'sky',
      bgSelected: 'bg-sky-50/90 border-sky-500 text-sky-950 ring-2 ring-sky-500/20',
      badgeColor: 'bg-sky-600 text-white'
    },
    { 
      id: 'ELECTRICAL_LOTO', 
      label: 'Electrical LOTO', 
      desc: 'Isolation, padlocks, 415V/11kV de-energization', 
      icon: Zap, 
      accentColor: 'amber',
      bgSelected: 'bg-amber-50/90 border-amber-500 text-amber-950 ring-2 ring-amber-500/20',
      badgeColor: 'bg-amber-600 text-slate-950'
    },
    { 
      id: 'CHEMICAL_HANDLING', 
      label: 'Chemical Handling', 
      desc: 'Acid, caustic, toxic, corrosive chemicals', 
      icon: FlaskConical, 
      accentColor: 'emerald',
      bgSelected: 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20',
      badgeColor: 'bg-emerald-600 text-white'
    },
    { 
      id: 'COLD_WORK', 
      label: 'Cold Work', 
      desc: 'General maintenance without spark or heat', 
      icon: Snowflake, 
      accentColor: 'cyan',
      bgSelected: 'bg-cyan-50/90 border-cyan-500 text-cyan-950 ring-2 ring-cyan-500/20',
      badgeColor: 'bg-cyan-600 text-white'
    },
  ];

  const currentTypeMeta = permitTypes.find(p => p.id === type) || permitTypes[0];
  const CurrentTypeIcon = currentTypeMeta.icon;

  const selectedPlantName = plants.find(p => p.id === plantId)?.name || 'Plant';
  const selectedAreaName = areas.find(a => a.id === areaId)?.name || 'Area';
  const selectedEquip = equipmentList.find(e => e.id === equipmentId);

  // Compute completeness score for right-hand preview
  const completeness = [
    Boolean(title.trim()),
    Boolean(workDescription.trim()),
    Boolean(plantId && areaId && equipmentId),
    hazards.length > 0,
    ppe.length > 0,
  ].filter(Boolean).length * 20;

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Permit to Work (PTW)
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              Step {currentStep} of 4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Follow the standardized industrial safety workflow to request high-hazard maintenance authorization.
          </p>
        </div>

        {/* Linear Stepper */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          {[
            { step: 1, label: 'Core Scope' },
            { step: 2, label: 'Hazards & PPE' },
            { step: 3, label: 'Safety Specs' },
            { step: 4, label: 'Verification' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStep === s.step
                  ? 'bg-slate-900 text-white shadow-xs'
                  : currentStep > s.step
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === s.step
                  ? 'bg-amber-400 text-slate-950'
                  : currentStep > s.step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > s.step ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
              </span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* 2-Column Split: Left = Form Wizard (68%), Right = Sticky Live Safety Permit Document (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================================== */}
        {/* LEFT COLUMN: ACTIVE STEP FORM */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          {/* STEP 1: CORE PERMIT DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Safety Type Card Selection */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2.5">
                  1. Select Industrial Safety Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {permitTypes.map((pt) => {
                    const Icon = pt.icon;
                    const isSelected = type === pt.id;
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setType(pt.id)}
                        role="button"
                        tabIndex={0}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all select-none relative group ${
                          isSelected
                            ? pt.bgSelected + ' shadow-md scale-[1.01]'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-xl ${
                            isSelected ? pt.badgeColor : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {pt.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal leading-snug mt-1">
                          {pt.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Title & Contractor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Permit Title / Work Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tack welding reinforcement brackets onto High Pressure Steam Rack"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assigned Contractor / Crew
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delta Industrial Services"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Work Scope Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Work Scope & Engineering Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail tools involved (e.g. angle grinders, torch cutting, hydraulic presses), specific pipe racks, welding passes, insulation stripping..."
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Cascading Plant -> Area -> Equipment Hierarchy */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>Physical Plant Location Hierarchy</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">1. Plant Facility</label>
                    <select
                      value={plantId}
                      onChange={(e) => setPlantId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {plants.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">2. Plant Area</label>
                    <select
                      value={areaId}
                      onChange={(e) => setAreaId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {filteredAreas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">3. Target Equipment</label>
                    <select
                      value={equipmentId}
                      onChange={(e) => setEquipmentId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {filteredEquipment.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name} ({eq.tag})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Planned Times */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Planned Work Validity Window</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Planned Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={plannedStartTime}
                      onChange={(e) => setPlannedStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Planned End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={plannedEndTime}
                      onChange={(e) => setPlannedEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HAZARDS & PPE CHIPS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Identified Hazards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    1. Work Site Hazards Assessment
                  </label>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {hazards.length} hazards selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[
                    'Open Flame / Sparks',
                    'Flammable Vapour / Gas',
                    'Combustible Dust',
                    'Toxic Atmosphere / Fumes',
                    'Oxygen Deficiency (<19.5%)',
                    'High Heat / Steam Burn',
                    'Electric Shock (415V/11kV)',
                    'Fall from Height (>2m)',
                    'Mechanical Pinch Points',
                    'Corrosive Chemical Splash',
                    'High Pressure Hydraulics',
                    'Falling Objects Overhead',
                  ].map((hazard) => {
                    const isChecked = hazards.includes(hazard);
                    return (
                      <button
                        key={hazard}
                        type="button"
                        onClick={() => toggleHazard(hazard)}
                        className={`text-left flex items-center justify-between p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500 text-amber-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{hazard}</span>
                        {isChecked ? (
                          <Check className="w-4 h-4 text-amber-600 stroke-[3]" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mandatory PPE */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    2. Mandatory PPE Enforcement
                  </label>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {ppe.length} PPE items required
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[
                    'Welding Helmet / Face Shield',
                    'Leather Welding Gloves',
                    'Safety Goggles with Side Shields',
                    'Full Body Harness with Double Lanyard',
                    '1000V Certified Insulated Gloves',
                    'Continuous Multi-Gas Detector',
                    'Flame Retardant Coverall',
                    'Steel-Toe Safety Boots',
                    'Ear Plugs / Noise Muffs',
                    'Chemical Splash Apron & Face Visor',
                    'Self-Contained Breathing Apparatus',
                    'Hard Hat with Chin Strap',
                  ].map((item) => {
                    const isChecked = ppe.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => togglePpe(item)}
                        className={`text-left flex items-center justify-between p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item}</span>
                        {isChecked ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pre-Operational Precautions */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  3. Standard Safety Precautions Checklist
                </label>
                <div className="space-y-2">
                  {precautions.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => togglePrecaution(idx)}
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 cursor-pointer select-none hover:bg-amber-50/50 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${
                        p.checked ? 'bg-amber-500 text-slate-950' : 'border border-slate-300'
                      }`}>
                        {p.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{p.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TYPE-SPECIFIC SAFETY SPECS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <TypeSpecificFields
                type={type}
                data={typeData}
                onChange={(field, val) => setTypeData((prev) => ({ ...prev, [field]: val }))}
              />
            </div>
          )}

          {/* STEP 4: REVIEW & VERIFICATION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Conflict Radar */}
              {conflicts.length > 0 ? (
                <ConflictBanner conflicts={conflicts} />
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm">Safe for Execution: Zero Conflicts Detected</h5>
                    <p className="text-[11px] text-emerald-800 font-normal mt-0.5">
                      The safety algorithm checked area schedules and confirmed zero hazardous permit collisions.
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Summary Table */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    Permit Verification Record
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Target Area: {selectedAreaName}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Permit Type</span>
                    <span className="font-bold text-slate-900">{currentTypeMeta.label}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Assigned Contractor</span>
                    <span className="font-bold text-slate-900">{contractorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Requester</span>
                    <span className="font-bold text-slate-900">{currentUser?.name || 'Murugan Technician'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Target Equipment</span>
                    <span className="font-bold text-slate-900">{selectedEquip?.name || 'Equipment'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 block font-medium mb-1">Permit Scope</span>
                  <p className="font-extrabold text-slate-900 text-sm">{title}</p>
                  <p className="text-slate-600 mt-1 text-xs">{workDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Step Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>{submitting ? 'Submitting...' : 'Submit for Approvals'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: STICKY LIVE SAFETY PERMIT DOCUMENT PREVIEW (32%) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Live Document Preview
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                PTW-2026-DRAFT
              </span>
            </div>

            {/* Type & Completeness Indicator */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${currentTypeMeta.badgeColor}`}>
                    <CurrentTypeIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-900">
                    {currentTypeMeta.label}
                  </span>
                </div>
                <span className="text-[11px] font-black text-slate-700">
                  {completeness}% Ready
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>

            {/* Live Title & Description */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Permit Scope</div>
              <div className="font-extrabold text-slate-900 text-sm line-clamp-2">
                {title.trim() || 'Untitled Safety Permit'}
              </div>
              <p className="text-slate-500 text-xs line-clamp-2">
                {workDescription.trim() || 'No detailed work description entered yet...'}
              </p>
            </div>

            {/* Hierarchy Snapshot */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Plant Target</div>
              <div className="font-bold text-slate-800">
                {selectedPlantName}
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                <span>Area:</span>
                <span className="font-bold text-slate-900">{selectedAreaName}</span>
              </div>
              {selectedEquip && (
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <span>Eq:</span>
                  <span className="font-bold text-slate-900">{selectedEquip.name}</span>
                  <span className="font-mono text-[10px] px-1 bg-white rounded border border-slate-200">
                    {selectedEquip.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Active Hazards & PPE Badges */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">Hazards Identified:</span>
                <span className="font-bold text-slate-900">{hazards.length}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">PPE Required:</span>
                <span className="font-bold text-slate-900">{ppe.length} items</span>
              </div>
            </div>

            {/* Live Conflict Radar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Area Conflict Status
                </span>
                {checkingConflicts ? (
                  <span className="text-[10px] text-slate-400 animate-pulse">Checking...</span>
                ) : conflicts.length > 0 ? (
                  <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    {conflicts.length} Overlap Alert
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Clear
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {conflicts.length > 0
                  ? 'Concurrent hazardous permits found in this plant area.'
                  : 'Automated conflict engine reports no overlapping hazardous permits.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
