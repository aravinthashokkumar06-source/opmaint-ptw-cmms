// ==============================================================================
// OPMAINT CMMS - SAFETY CONFLICT DETECTION SERVICE
// Prevents high-hazard accidents (e.g. Hot Work overlapping with Confined Space)
// ==============================================================================

import { prisma } from "@/backend/db/prisma";

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingPermits: Array<{
    id: string;
    permitNumber: string;
    type: string;
    status: string;
    areaName: string;
    startTime: string;
    endTime: string;
    warningMessage: string;
  }>;
}

/**
 * Checks for dangerous co-located permits (e.g. Hot Work overlapping with Confined Space).
 * This is a major real-world industrial accident prevention algorithm.
 */
export async function detectPermitConflicts(params: {
  permitId?: string; // Exclude current permit if updating
  type: string;
  areaId: string;
  plannedStartTime: Date;
  plannedEndTime: Date;
}): Promise<ConflictCheckResult> {
  const { permitId, type, areaId, plannedStartTime, plannedEndTime } = params;

  // Active or pending permits that are currently occupying plant areas
  const activeOrPendingStatuses = [
    "PENDING_APPROVAL",
    "APPROVED",
    "ACTIVE",
    "SUSPENDED",
  ];

  // Find permits in the same plant area that overlap in the validity time window
  const overlappingPermits = await prisma.permit.findMany({
    where: {
      id: permitId ? { not: permitId } : undefined,
      areaId: areaId,
      status: { in: activeOrPendingStatuses },
      OR: [
        {
          plannedStartTime: { lt: plannedEndTime },
          plannedEndTime: { gt: plannedStartTime },
        },
      ],
    },
    include: {
      area: true,
      equipment: true,
    },
  });

  const conflicts: ConflictCheckResult["conflictingPermits"] = [];

  for (const existing of overlappingPermits) {
    let warningMessage = "";

    // 1. Extreme Hazard: Hot Work + Confined Space in same Area
    if (
      (type === "HOT_WORK" && existing.type === "CONFINED_SPACE") ||
      (type === "CONFINED_SPACE" && existing.type === "HOT_WORK")
    ) {
      warningMessage = `CRITICAL SAFETY CONFLICT: Hot Work (${type}) overlaps in time and location with Confined Space entry (${existing.permitNumber}) in ${existing.area.name}. Sparks or toxic/flammable fumes pose severe explosion or asphyxiation risk!`;
      conflicts.push({
        id: existing.id,
        permitNumber: existing.permitNumber,
        type: existing.type,
        status: existing.status,
        areaName: existing.area.name,
        startTime: existing.plannedStartTime.toISOString(),
        endTime: existing.plannedEndTime.toISOString(),
        warningMessage,
      });
    }

    // 2. High Hazard: Multiple Hot Works in same Area
    else if (type === "HOT_WORK" && existing.type === "HOT_WORK") {
      warningMessage = `CONCURRENT HOT WORK: Multiple hot works occurring simultaneously in ${existing.area.name} (${existing.permitNumber}). Fire watch and combustible separation must be verified.`;
      conflicts.push({
        id: existing.id,
        permitNumber: existing.permitNumber,
        type: existing.type,
        status: existing.status,
        areaName: existing.area.name,
        startTime: existing.plannedStartTime.toISOString(),
        endTime: existing.plannedEndTime.toISOString(),
        warningMessage,
      });
    }

    // 3. Electrical LOTO + Any live work on same equipment
    else if (
      (type === "ELECTRICAL_LOTO" || existing.type === "ELECTRICAL_LOTO") &&
      existing.equipmentId === params.permitId
    ) {
      warningMessage = `LOTO CONFLICT: Work scheduled on equipment under electrical lockout/tagout isolation (${existing.permitNumber}).`;
      conflicts.push({
        id: existing.id,
        permitNumber: existing.permitNumber,
        type: existing.type,
        status: existing.status,
        areaName: existing.area.name,
        startTime: existing.plannedStartTime.toISOString(),
        endTime: existing.plannedEndTime.toISOString(),
        warningMessage,
      });
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflictingPermits: conflicts,
  };
}
