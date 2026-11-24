// ==============================================================================
// OPMAINT CMMS - PERMIT TO WORK (PTW) STATE MACHINE ENGINE
// Pure, deterministic business logic service for lifecycle & RBAC enforcement
// ==============================================================================

import { Role, PermitStatus, PermitType } from "@/backend/types";

export interface PermitEntity {
  id: string;
  permitNumber: string;
  type: PermitType;
  status: PermitStatus;
  requesterId: string;
  areaId: string;
  area?: {
    id: string;
    ownerId?: string | null;
  };
  plannedStartTime: Date | string;
  plannedEndTime: Date | string;
  actualStartTime?: Date | string | null;
  actualEndTime?: Date | string | null;
  approvals: Array<{
    id?: string;
    approverId: string;
    roleRequired: Role;
    status: "PENDING" | "APPROVED" | "REJECTED";
    comments?: string | null;
  }>;
}

export interface UserContext {
  id: string;
  role: Role;
  name: string;
  email: string;
}

export type StateTransitionAction =
  | "SUBMIT"
  | "APPROVE"
  | "REJECT"
  | "ACTIVATE"
  | "SUSPEND"
  | "RESUME"
  | "CLOSE"
  | "VERIFY_CLOSURE"
  | "CANCEL"
  | "EXPIRE";

export interface TransitionResult {
  allowed: boolean;
  nextStatus?: PermitStatus;
  error?: string;
}

/**
 * Pure state machine transition validator for PTW lifecycle.
 * Server-side enforcement ensuring zero illegal transitions.
 */
export function validateStateTransition(
  permit: PermitEntity,
  action: StateTransitionAction,
  user: UserContext,
  options?: {
    now?: Date;
    comments?: string;
    rejectionReason?: string;
  }
): TransitionResult {
  const now = options?.now || new Date();
  const currentStatus = permit.status;

  // 1. Terminal States Check:
  // Once in REJECTED, EXPIRED, CANCELLED, or CLOSED_VERIFIED, no further transitions are allowed.
  const terminalStates: PermitStatus[] = [
    "REJECTED",
    "EXPIRED",
    "CANCELLED",
    "CLOSED_VERIFIED",
  ];

  if (terminalStates.includes(currentStatus)) {
    return {
      allowed: false,
      error: `Permit is in terminal state '${currentStatus}'. No further lifecycle transitions are permitted.`,
    };
  }

  // 2. Critical Safety Rule: Self-Approval Prohibition
  // "A person can never approve their own permit, even if their role would otherwise allow it."
  if (action === "APPROVE" || action === "REJECT") {
    if (user.id === permit.requesterId) {
      return {
        allowed: false,
        error: "Self-approval violation: A person can never approve or reject their own permit.",
      };
    }
  }

  // 3. Action-specific validation & state machine enforcement
  switch (action) {
    case "SUBMIT": {
      if (currentStatus !== "DRAFT") {
        return {
          allowed: false,
          error: `Cannot SUBMIT. Only permits in 'DRAFT' status can be submitted. Current status: ${currentStatus}`,
        };
      }
      if (user.role !== "REQUESTER" && user.role !== "ADMIN" && user.id !== permit.requesterId) {
        return {
          allowed: false,
          error: "Only the permit requester or an admin can submit the permit.",
        };
      }
      return { allowed: true, nextStatus: "PENDING_APPROVAL" };
    }

    case "APPROVE": {
      if (currentStatus !== "PENDING_APPROVAL") {
        return {
          allowed: false,
          error: `Cannot APPROVE. Permit must be in 'PENDING_APPROVAL' status. Current status: ${currentStatus}`,
        };
      }

      if (user.role === "REQUESTER") {
        return {
          allowed: false,
          error: "Requesters cannot approve permits.",
        };
      }

      // Area Owner can only approve equipment in their assigned plant area
      if (user.role === "AREA_OWNER") {
        if (permit.area?.ownerId && permit.area.ownerId !== user.id) {
          return {
            allowed: false,
            error: "Area Owners can only approve permits for equipment within their assigned area.",
          };
        }
      }

      // Check user role matches a required approver or is admin
      const userMatchesRequired = permit.approvals.some(
        (a) => a.roleRequired === user.role || user.role === "ADMIN"
      );

      if (!userMatchesRequired && user.role !== "SAFETY_OFFICER" && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: `User role '${user.role}' is not a designated approver for this permit.`,
        };
      }

      // Check if all designated approvers will be satisfied
      const pendingApprovals = permit.approvals.filter((a) => a.status === "PENDING");
      const otherPending = pendingApprovals.filter(
        (a) => a.roleRequired !== user.role && !(user.role === "ADMIN")
      );

      const allWillBeApproved = otherPending.length === 0;

      return {
        allowed: true,
        nextStatus: allWillBeApproved ? "APPROVED" : "PENDING_APPROVAL",
      };
    }

    case "REJECT": {
      if (currentStatus !== "PENDING_APPROVAL") {
        return {
          allowed: false,
          error: `Cannot REJECT. Permit must be in 'PENDING_APPROVAL' status. Current status: ${currentStatus}`,
        };
      }
      if (!options?.rejectionReason || options.rejectionReason.trim().length === 0) {
        return {
          allowed: false,
          error: "A mandatory rejection reason is required to reject a permit.",
        };
      }
      if (user.role !== "AREA_OWNER" && user.role !== "SAFETY_OFFICER" && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: "Unauthorized: Only Area Owners, Safety Officers, or Admins can reject permits.",
        };
      }
      return { allowed: true, nextStatus: "REJECTED" };
    }

    case "ACTIVATE": {
      if (currentStatus !== "APPROVED") {
        return {
          allowed: false,
          error: `Cannot ACTIVATE. Permit must be 'APPROVED' first. Current status: ${currentStatus}`,
        };
      }

      // Rule: Every required approver has approved
      const hasUnapproved = permit.approvals.some((a) => a.status !== "APPROVED");
      if (hasUnapproved && permit.approvals.length > 0) {
        return {
          allowed: false,
          error: "Cannot activate permit until every required approver has approved.",
        };
      }

      // Rule: Cannot activate before planned start time
      const plannedStart = new Date(permit.plannedStartTime);
      if (now < plannedStart) {
        return {
          allowed: false,
          error: `Cannot activate before planned start time: ${plannedStart.toISOString()}`,
        };
      }

      // Rule: Cannot activate after planned validity window ends
      const plannedEnd = new Date(permit.plannedEndTime);
      if (now > plannedEnd) {
        return {
          allowed: false,
          error: "Cannot activate permit because its planned validity window has already passed (Expired).",
        };
      }

      return { allowed: true, nextStatus: "ACTIVE" };
    }

    case "SUSPEND": {
      if (currentStatus !== "ACTIVE") {
        return {
          allowed: false,
          error: `Cannot SUSPEND. Only 'ACTIVE' permits can be suspended. Current status: ${currentStatus}`,
        };
      }
      if (user.role !== "SAFETY_OFFICER" && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: "Only a Safety Officer or Admin can instantly suspend an active permit.",
        };
      }
      return { allowed: true, nextStatus: "SUSPENDED" };
    }

    case "RESUME": {
      if (currentStatus !== "SUSPENDED") {
        return {
          allowed: false,
          error: `Cannot RESUME. Only 'SUSPENDED' permits can be resumed. Current status: ${currentStatus}`,
        };
      }
      const plannedEnd = new Date(permit.plannedEndTime);
      if (now > plannedEnd) {
        return {
          allowed: false,
          error: "Cannot resume suspended permit because its validity window has expired.",
        };
      }
      if (user.role !== "SAFETY_OFFICER" && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: "Only a Safety Officer or Admin can resume a suspended permit.",
        };
      }
      return { allowed: true, nextStatus: "ACTIVE" };
    }

    case "CLOSE": {
      if (currentStatus !== "ACTIVE") {
        return {
          allowed: false,
          error: `Cannot CLOSE. Work cannot be closed unless permit is 'ACTIVE'. Current status: ${currentStatus}`,
        };
      }
      if (user.id !== permit.requesterId && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: "Only the requester who raised the permit can mark work as completed/closed.",
        };
      }
      return { allowed: true, nextStatus: "CLOSED" };
    }

    case "VERIFY_CLOSURE": {
      if (currentStatus !== "CLOSED") {
        return {
          allowed: false,
          error: `Cannot VERIFY_CLOSURE. Permit must be in 'CLOSED' status. Current status: ${currentStatus}`,
        };
      }
      if (user.role !== "SAFETY_OFFICER" && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: "Only a Safety Officer or Admin can perform closure verification.",
        };
      }
      return { allowed: true, nextStatus: "CLOSED_VERIFIED" };
    }

    case "CANCEL": {
      if (user.id !== permit.requesterId && user.role !== "ADMIN") {
        return {
          allowed: false,
          error: "Only the requester or an admin can cancel this permit.",
        };
      }
      return { allowed: true, nextStatus: "CANCELLED" };
    }

    case "EXPIRE": {
      const plannedEnd = new Date(permit.plannedEndTime);
      if (
        now >= plannedEnd &&
        (currentStatus === "PENDING_APPROVAL" ||
          currentStatus === "APPROVED" ||
          currentStatus === "ACTIVE" ||
          currentStatus === "SUSPENDED")
      ) {
        return { allowed: true, nextStatus: "EXPIRED" };
      }
      return {
        allowed: false,
        error: "Permit has not yet passed its planned end validity time.",
      };
    }

    default:
      return { allowed: false, error: `Unknown action requested: ${action}` };
  }
}
