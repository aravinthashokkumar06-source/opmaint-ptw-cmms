import { NextRequest, NextResponse } from "next/server";
import { detectPermitConflicts } from "@/backend/services/conflictDetection";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, areaId, plannedStartTime, plannedEndTime, permitId } = body;

    if (!type || !areaId || !plannedStartTime || !plannedEndTime) {
      return NextResponse.json({ hasConflict: false, conflictingPermits: [] });
    }

    const startDate = new Date(plannedStartTime);
    const endDate = new Date(plannedEndTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) {
      return NextResponse.json({ hasConflict: false, conflictingPermits: [] });
    }

    const result = await detectPermitConflicts({
      permitId,
      type,
      areaId,
      plannedStartTime: startDate,
      plannedEndTime: endDate,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Conflict check error:", err);
    return NextResponse.json({ hasConflict: false, conflictingPermits: [] });
  }
}
