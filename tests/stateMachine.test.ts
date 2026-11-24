// ==============================================================================
// OPMAINT CMMS - AUTOMATED STATE MACHINE UNIT TEST SUITE
// Tests all mission-critical safety rules and permission boundaries
// ==============================================================================

import { describe, it, expect } from "vitest";
import {
  validateStateTransition,
  PermitEntity,
  UserContext,
} from "../src/backend/services/stateMachine";

describe("PTW State Machine & Permission Enforcement", () => {
  const requesterUser: UserContext = {
    id: "user-req-1",
    role: "REQUESTER",
    name: "Murugan Technician",
    email: "requester@opmaint.com",
  };

  const areaOwnerUser: UserContext = {
    id: "user-ao-1",
    role: "AREA_OWNER",
    name: "Karthik Area Owner",
    email: "areaowner@opmaint.com",
  };

  const otherAreaOwnerUser: UserContext = {
    id: "user-ao-2",
    role: "AREA_OWNER",
    name: "Different Area Owner",
    email: "otherao@opmaint.com",
  };

  const safetyOfficerUser: UserContext = {
    id: "user-so-1",
    role: "SAFETY_OFFICER",
    name: "Suresh Safety Officer",
    email: "safety@opmaint.com",
  };

  const basePermit: PermitEntity = {
    id: "permit-101",
    permitNumber: "PTW-2026-0001",
    type: "HOT_WORK",
    status: "PENDING_APPROVAL",
    requesterId: "user-req-1",
    areaId: "area-1",
    area: {
      id: "area-1",
      ownerId: "user-ao-1",
    },
    plannedStartTime: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    plannedEndTime: new Date(Date.now() + 7200 * 1000),  // 2 hours in future
    approvals: [
      { approverId: "user-ao-1", roleRequired: "AREA_OWNER", status: "PENDING" },
      { approverId: "user-so-1", roleRequired: "SAFETY_OFFICER", status: "PENDING" },
    ],
  };

  it("CRITICAL RULE: Rejects self-approval when requester attempts to approve own permit", () => {
    // Even if requester tries to hit the approve API, self-approval must fail
    const result = validateStateTransition(basePermit, "APPROVE", requesterUser);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("Self-approval violation");
  });

  it("CRITICAL RULE: Area Owner cannot approve permits for equipment outside their assigned area", () => {
    const result = validateStateTransition(basePermit, "APPROVE", otherAreaOwnerUser);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("Area Owners can only approve permits for equipment within their assigned area");
  });

  it("Allows Area Owner to approve within their area, status remains PENDING_APPROVAL if safety pending", () => {
    const result = validateStateTransition(basePermit, "APPROVE", areaOwnerUser);
    expect(result.allowed).toBe(true);
    expect(result.nextStatus).toBe("PENDING_APPROVAL");
  });

  it("Moves to APPROVED once all required approvals are satisfied", () => {
    const permitWithOneApproval: PermitEntity = {
      ...basePermit,
      approvals: [
        { approverId: "user-ao-1", roleRequired: "AREA_OWNER", status: "APPROVED" },
        { approverId: "user-so-1", roleRequired: "SAFETY_OFFICER", status: "PENDING" },
      ],
    };

    const result = validateStateTransition(permitWithOneApproval, "APPROVE", safetyOfficerUser);
    expect(result.allowed).toBe(true);
    expect(result.nextStatus).toBe("APPROVED");
  });

  it("CRITICAL RULE: Cannot ACTIVATE permit if planned start time has not arrived yet", () => {
    const futurePermit: PermitEntity = {
      ...basePermit,
      status: "APPROVED",
      plannedStartTime: new Date(Date.now() + 3600 * 1000), // 1 hour in future
      plannedEndTime: new Date(Date.now() + 14400 * 1000),
      approvals: [
        { approverId: "user-ao-1", roleRequired: "AREA_OWNER", status: "APPROVED" },
        { approverId: "user-so-1", roleRequired: "SAFETY_OFFICER", status: "APPROVED" },
      ],
    };

    const result = validateStateTransition(futurePermit, "ACTIVATE", requesterUser);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("Cannot activate before planned start time");
  });

  it("CRITICAL RULE: Cannot ACTIVATE permit if approvals are incomplete", () => {
    const incompletePermit: PermitEntity = {
      ...basePermit,
      status: "APPROVED",
      plannedStartTime: new Date(Date.now() - 3600 * 1000),
      approvals: [
        { approverId: "user-ao-1", roleRequired: "AREA_OWNER", status: "APPROVED" },
        { approverId: "user-so-1", roleRequired: "SAFETY_OFFICER", status: "PENDING" },
      ],
    };

    const result = validateStateTransition(incompletePermit, "ACTIVATE", requesterUser);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("every required approver has approved");
  });

  it("Allows activation when fully approved and within planned time", () => {
    const validApprovedPermit: PermitEntity = {
      ...basePermit,
      status: "APPROVED",
      plannedStartTime: new Date(Date.now() - 1000),
      plannedEndTime: new Date(Date.now() + 3600 * 1000),
      approvals: [
        { approverId: "user-ao-1", roleRequired: "AREA_OWNER", status: "APPROVED" },
        { approverId: "user-so-1", roleRequired: "SAFETY_OFFICER", status: "APPROVED" },
      ],
    };

    const result = validateStateTransition(validApprovedPermit, "ACTIVATE", requesterUser);
    expect(result.allowed).toBe(true);
    expect(result.nextStatus).toBe("ACTIVE");
  });

  it("Safety Officer can instantly suspend an active permit", () => {
    const activePermit: PermitEntity = {
      ...basePermit,
      status: "ACTIVE",
    };

    const result = validateStateTransition(activePermit, "SUSPEND", safetyOfficerUser);
    expect(result.allowed).toBe(true);
    expect(result.nextStatus).toBe("SUSPENDED");
  });

  it("Requester cannot suspend a permit", () => {
    const activePermit: PermitEntity = {
      ...basePermit,
      status: "ACTIVE",
    };

    const result = validateStateTransition(activePermit, "SUSPEND", requesterUser);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("Only a Safety Officer or Admin can instantly suspend");
  });

  it("Prevents any transition on terminal states (e.g. EXPIRED, REJECTED)", () => {
    const expiredPermit: PermitEntity = {
      ...basePermit,
      status: "EXPIRED",
    };

    const result = validateStateTransition(expiredPermit, "ACTIVATE", requesterUser);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("Permit is in terminal state 'EXPIRED'");
  });
});
