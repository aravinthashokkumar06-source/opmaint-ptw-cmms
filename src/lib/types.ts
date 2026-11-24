// ==============================================================================
// OPMAINT CMMS - DOMAIN MODEL TYPES & TYPE-SPECIFIC SCHEMAS
// Senior Architectural Design: Typed Polymorphic Entities
// ==============================================================================

export type Role = "REQUESTER" | "AREA_OWNER" | "SAFETY_OFFICER" | "ADMIN";

export type PermitType =
  | "HOT_WORK"
  | "CONFINED_SPACE"
  | "WORKING_AT_HEIGHT"
  | "ELECTRICAL_LOTO"
  | "EXCAVATION"; // 5th extensible type

export type PermitStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "CLOSED"
  | "CLOSED_VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

// ------------------------------------------------------------------------------
// Type-Specific Field Schemas (Polymorphic attributes)
// ------------------------------------------------------------------------------

/** 1. Hot Work Technical Specifications */
export interface HotWorkData {
  hotWorkType: "welding" | "grinding" | "cutting" | "soldering";
  fireWatchAssigned: string;
  fireExtinguisherType: string;
  combustiblesClearedRadiusMeters: number;
  gasTestReadings: {
    lelPercent: number; // Lower Explosive Limit % (must be 0%)
    o2Percent: number;  // Oxygen % (19.5% - 21.5%)
    testTime: string;
    testedBy: string;
  };
}

/** 2. Confined Space Entry Specifications */
export interface ConfinedSpaceData {
  spaceId: string;
  entryPoint: string;
  standbyAttendantName: string;
  rescuePlan: string;
  ventilationMethod: string;
  atmosphericTest: {
    o2Percent: number;  // Oxygen %
    lelPercent: number; // LEL %
    h2sPpm: number;     // Hydrogen Sulfide ppm (Toxic)
    coPpm: number;      // Carbon Monoxide ppm (Toxic)
    testTime: string;
    testedBy: string;
  };
  entryExitLog?: Array<{
    personName: string;
    entryTime: string;
    exitTime?: string;
  }>;
}

/** 3. Working at Height Specifications */
export interface WorkingAtHeightData {
  heightInMeters: number;
  accessMethod: "scaffold" | "ladder" | "MEWP" | "rope";
  fallArrestEquipment: string;
  anchorPointChecked: boolean;
  barricadingBelow: boolean;
}

/** 4. Electrical / Isolation (LOTO) Specifications */
export interface ElectricalLotoData {
  equipmentTag: string;
  voltageLevel: string; // e.g. "415V 3-Phase", "11kV"
  isolationPointsList: Array<{ point: string; method: string }>;
  lockNumbers: string[];
  tagNumbers: string[];
  earthingApplied: boolean;
  testedDeadBy: string;
}

/** 5. Excavation Specifications (Extensibility demonstration) */
export interface ExcavationData {
  depthInMeters: number;
  undergroundUtilitiesChecked: boolean;
  shoringProvided: boolean;
  gasTestingRequired: boolean;
}

export type PermitTypeSpecificData =
  | HotWorkData
  | ConfinedSpaceData
  | WorkingAtHeightData
  | ElectricalLotoData
  | ExcavationData;
