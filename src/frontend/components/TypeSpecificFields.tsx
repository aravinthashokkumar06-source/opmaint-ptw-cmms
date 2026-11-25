'use client';

import React from 'react';
import { Flame, Box, ArrowUpRight, Zap, FlaskConical, Snowflake, ShieldCheck } from 'lucide-react';

interface TypeSpecificFieldsProps {
  type: string;
  data: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export const TypeSpecificFields: React.FC<TypeSpecificFieldsProps> = ({
  type,
  data,
  onChange,
}) => {
  switch (type) {
    case 'HOT_WORK':
      return (
        <div className="space-y-4 p-5 rounded-2xl bg-orange-50/50 border border-orange-200">
          <div className="flex items-center gap-2 text-orange-900 font-bold text-sm border-b border-orange-200/80 pb-2">
            <Flame className="w-4 h-4 text-orange-600" />
            <span>Hot Work Technical Safety Parameters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hot Work Category</label>
              <select
                value={data.hotWorkType || 'welding'}
                onChange={(e) => onChange('hotWorkType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="welding">Electric Arc / TIG Welding</option>
                <option value="cutting">Oxy-Acetylene Flame Cutting</option>
                <option value="grinding">Angle Grinding / Spark Producing</option>
                <option value="brazing">Brazing & Torch Soldering</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designated Fire Watch Person</label>
              <input
                type="text"
                placeholder="e.g. Vignesh Kumar (Certified Fire Watch)"
                value={data.fireWatchAssigned || ''}
                onChange={(e) => onChange('fireWatchAssigned', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fire Extinguisher Stationed on Site</label>
              <input
                type="text"
                placeholder="e.g. CO2 5kg + DCP 9kg"
                value={data.fireExtinguisherType || ''}
                onChange={(e) => onChange('fireExtinguisherType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Combustibles Cleared Radius (Meters)</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 10 or 15"
                value={data.combustiblesClearedRadiusMeters || 10}
                onChange={(e) => onChange('combustiblesClearedRadiusMeters', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-orange-200/80">
            <h5 className="font-bold text-slate-800 text-xs mb-2">Pre-Work Gas Atmosphere Verification</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">LEL % (Flammable Gas)</label>
                <input
                  type="number"
                  placeholder="0 %"
                  value={data.gasTestReadings?.lelPercent ?? 0}
                  onChange={(e) =>
                    onChange('gasTestReadings', {
                      ...data.gasTestReadings,
                      lelPercent: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">O2 % (Oxygen)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="20.9 %"
                  value={data.gasTestReadings?.o2Percent ?? 20.9}
                  onChange={(e) =>
                    onChange('gasTestReadings', {
                      ...data.gasTestReadings,
                      o2Percent: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Tested By</label>
                <input
                  type="text"
                  placeholder="Technician name"
                  value={data.gasTestReadings?.testedBy || ''}
                  onChange={(e) =>
                    onChange('gasTestReadings', {
                      ...data.gasTestReadings,
                      testedBy: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Test Time</label>
                <input
                  type="datetime-local"
                  value={data.gasTestReadings?.testTime || ''}
                  onChange={(e) =>
                    onChange('gasTestReadings', {
                      ...data.gasTestReadings,
                      testTime: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'CONFINED_SPACE':
      return (
        <div className="space-y-4 p-5 rounded-2xl bg-purple-50/50 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm border-b border-purple-200/80 pb-2">
            <Box className="w-4 h-4 text-purple-600" />
            <span>Confined Space Entry Specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vessel / Tank / Space Tag ID</label>
              <input
                type="text"
                placeholder="e.g. TNK-ETP-INT-01 or Boile Drum #2"
                value={data.spaceId || ''}
                onChange={(e) => onChange('spaceId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designated Standby Attendant (Manhole Watch)</label>
              <input
                type="text"
                placeholder="Attendant stationed at entry point"
                value={data.standbyAttendantName || ''}
                onChange={(e) => onChange('standbyAttendantName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mechanical Forced Ventilation (CFM)</label>
              <input
                type="text"
                placeholder="e.g. Continuous blower (3000 CFM)"
                value={data.ventilationMethod || ''}
                onChange={(e) => onChange('ventilationMethod', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Rescue Plan & Equipment</label>
              <input
                type="text"
                placeholder="e.g. Tripod winch with retrieval harness; siren"
                value={data.rescuePlan || ''}
                onChange={(e) => onChange('rescuePlan', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      );

    case 'WORKING_AT_HEIGHT':
      return (
        <div className="space-y-4 p-5 rounded-2xl bg-sky-50/50 border border-sky-200">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-sm border-b border-sky-200/80 pb-2">
            <ArrowUpRight className="w-4 h-4 text-sky-600" />
            <span>Working at Height Safety Controls</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Elevation Height (Meters)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 8.5"
                value={data.heightInMeters || ''}
                onChange={(e) => onChange('heightInMeters', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Elevated Access Method</label>
              <select
                value={data.accessMethod || 'scaffolding'}
                onChange={(e) => onChange('accessMethod', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="scaffolding">Certified Green-Tagged Scaffolding</option>
                <option value="mewp">MEWP / Boom Lift (Hydraulic Cherry Picker)</option>
                <option value="tower">Mobile Scaffolding Tower</option>
                <option value="ladder">Secured Safety Ladder (Under 6m)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="anchorPointChecked"
                checked={data.anchorPointChecked || false}
                onChange={(e) => onChange('anchorPointChecked', e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="anchorPointChecked" className="font-semibold text-slate-800">
                Overhead Anchor Point Inspected & Rated (Certified 5000 lbs)
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="barricadingBelow"
                checked={data.barricadingBelow || false}
                onChange={(e) => onChange('barricadingBelow', e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="barricadingBelow" className="font-semibold text-slate-800">
                Ground Drop Zone Barricaded with Warning Signage
              </label>
            </div>
          </div>
        </div>
      );

    case 'ELECTRICAL_LOTO':
      return (
        <div className="space-y-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-amber-200/80 pb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Lockout / Tagout (LOTO) Energy Isolation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipment Voltage Rating</label>
              <select
                value={data.voltageLevel || '415V 3-Phase'}
                onChange={(e) => onChange('voltageLevel', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="415V 3-Phase">415V 3-Phase Industrial Low Voltage</option>
                <option value="11kV High Voltage">11kV High Voltage Substation Feeder</option>
                <option value="230V Single Phase">230V Single Phase Auxiliary</option>
                <option value="DC Control Voltage">110V DC Battery Bank / Control</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Master Padlock ID Numbers</label>
              <input
                type="text"
                placeholder="e.g. LOTO-RED-104, LOTO-BLU-205"
                value={data.lockNumbers ? data.lockNumbers.join(', ') : ''}
                onChange={(e) =>
                  onChange(
                    'lockNumbers',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Primary Isolation Point & Breaker Feeder Tag</label>
              <input
                type="text"
                placeholder="e.g. MCC-Panel-03 Feeder Breaker B-14 Padlocked in Open Position"
                value={data.isolationPoint || ''}
                onChange={(e) => onChange('isolationPoint', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 md:col-span-2">
              <input
                type="checkbox"
                id="zeroEnergyVerified"
                checked={data.zeroEnergyVerified || false}
                onChange={(e) => onChange('zeroEnergyVerified', e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="zeroEnergyVerified" className="font-semibold text-slate-800">
                Zero Energy State Verified via Calibrated Multimeter (Live-Dead-Live Test Done)
              </label>
            </div>
          </div>
        </div>
      );

    case 'CHEMICAL_HANDLING':
      return (
        <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-emerald-200/80 pb-2">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>Hazardous Chemical Safety Controls</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chemical Substance Name / CAS #</label>
              <input
                type="text"
                placeholder="e.g. Sulfuric Acid 98% or Toluene"
                value={data.chemicalName || ''}
                onChange={(e) => onChange('chemicalName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Eyewash & Safety Shower Location</label>
              <input
                type="text"
                placeholder="e.g. Station SS-02 within 10 meters"
                value={data.eyewashLocation || ''}
                onChange={(e) => onChange('eyewashLocation', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
