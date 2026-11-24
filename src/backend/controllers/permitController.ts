// ==============================================================================
// OPMAINT CMMS - PERMIT CONTROLLER
// Handles HTTP Request/Response, Validation, and orchestrates Services & DB
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/backend/db/prisma";
import { getCurrentUser } from "@/backend/middleware/auth";
import { detectPermitConflicts } from "@/backend/services/conflictDetection";
import {
  validateStateTransition,
  StateTransitionAction,
} from "@/backend/services/stateMachine";
import { PermitStatus, Role } from "@/backend/types";

export class PermitController {
  /**
   * GET /api/permits
   * Lists permits with dynamic filters, evaluations auto-expiry, and aggregates stats.
   */
  async getPermits(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");
      const type = searchParams.get("type");
      const areaId = searchParams.get("areaId");
      const expiringSoon = searchParams.get("expiringSoon") === "true";
      const myApprovalsPending = searchParams.get("myApprovalsPending") === "true" || searchParams.get("myApprovalsOnly") === "true";

      const currentUser = await getCurrentUser(req);
      const now = new Date();

      // 1. Server-side auto-expiry evaluator for validity windows
      const expiredCandidates = await prisma.permit.findMany({
        where: {
          status: { in: ["PENDING_APPROVAL", "APPROVED", "ACTIVE", "SUSPENDED"] },
          plannedEndTime: { lt: now },
        },
      });

      for (const exp of expiredCandidates) {
        await prisma.$transaction([
          prisma.permit.update({
            where: { id: exp.id },
            data: { status: "EXPIRED" },
          }),
          prisma.permitAuditLog.create({
            data: {
              permitId: exp.id,
              action: "EXPIRED",
              performedById: currentUser.id,
              fromStatus: exp.status,
              toStatus: "EXPIRED",
              comment: "Permit validity window elapsed. System auto-expired the permit.",
            },
          }),
        ]);
      }

      // 2. Build where filter
      const where: any = {};

      if (status && status !== "ALL") where.status = status;
      if (type && type !== "ALL") where.type = type;
      if (areaId && areaId !== "ALL") where.areaId = areaId;

      if (expiringSoon) {
        const twoHoursFromNow = new Date(now.getTime() + 2 * 3600 * 1000);
        where.status = "ACTIVE";
        where.plannedEndTime = { gte: now, lte: twoHoursFromNow };
      }

      if (myApprovalsPending) {
        where.status = "PENDING_APPROVAL";
        where.approvals = {
          some: {
            status: "PENDING",
            roleRequired: currentUser.role === "ADMIN" ? undefined : currentUser.role,
          },
        };
      }

      const permits = await prisma.permit.findMany({
        where,
        include: {
          plant: true,
          area: {
            include: {
              owner: { select: { id: true, name: true } },
            },
          },
          equipment: true,
          requester: { select: { id: true, name: true, email: true } },
          approvals: {
            include: { approver: { select: { id: true, name: true, role: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // 3. Aggregate high-level plant stats
      const totalCount = await prisma.permit.count();
      const activeCount = await prisma.permit.count({ where: { status: "ACTIVE" } });
      const pendingCount = await prisma.permit.count({ where: { status: "PENDING_APPROVAL" } });
      const twoHoursFromNow = new Date(now.getTime() + 2 * 3600 * 1000);
      const expiringSoonCount = await prisma.permit.count({
        where: {
          status: "ACTIVE",
          plannedEndTime: { gte: now, lte: twoHoursFromNow },
        },
      });

      return NextResponse.json({
        permits,
        stats: {
          total: totalCount,
          active: activeCount,
          pending: pendingCount,
          expiringSoon: expiringSoonCount,
        },
        currentUser,
      });
    } catch (error: any) {
      console.error("PermitController.getPermits error:", error);
      return NextResponse.json({ error: "Failed to fetch permits." }, { status: 500 });
    }
  }

  /**
   * GET /api/permits/[id]
   * Returns complete permit entity with parsed checklists, approvals, and audit trail.
   */
  async getPermitById(req: NextRequest, id: string) {
    try {
      const currentUser = await getCurrentUser(req);
      const permit = await prisma.permit.findUnique({
        where: { id },
        include: {
          plant: true,
          area: {
            include: {
              owner: { select: { id: true, name: true, email: true } },
            },
          },
          equipment: true,
          requester: {
            select: { id: true, name: true, email: true, department: true },
          },
          approvals: {
            include: {
              approver: { select: { id: true, name: true, email: true, role: true } },
            },
          },
          auditLogs: {
            include: {
              performedBy: { select: { id: true, name: true, role: true } },
            },
            orderBy: { timestamp: "desc" },
          },
        },
      });

      if (!permit) {
        return NextResponse.json({ error: "Permit not found" }, { status: 404 });
      }

      const parsedPermit = {
        ...permit,
        hazardsIdentified: JSON.parse(permit.hazardsIdentified || "[]"),
        ppeRequired: JSON.parse(permit.ppeRequired || "[]"),
        precautionsChecklist: JSON.parse(permit.precautionsChecklist || "[]"),
        typeSpecificData: JSON.parse(permit.typeSpecificData || "{}"),
      };

      const conflictResult = await detectPermitConflicts({
        permitId: permit.id,
        type: permit.type,
        areaId: permit.areaId,
        plannedStartTime: permit.plannedStartTime,
        plannedEndTime: permit.plannedEndTime,
      });

      return NextResponse.json({
        permit: parsedPermit,
        currentUser,
        conflicts: conflictResult.hasConflict ? conflictResult.conflictingPermits : [],
      });
    } catch (error: any) {
      console.error("PermitController.getPermitById error:", error);
      return NextResponse.json({ error: "Failed to fetch permit." }, { status: 500 });
    }
  }

  /**
   * POST /api/permits
   * Creates new permit with conflict detection check and initial audit log.
   */
  async createPermit(req: NextRequest) {
    try {
      const currentUser = await getCurrentUser(req);
      const body = await req.json();

      const {
        type,
        contractorName,
        workDescription,
        plantId,
        areaId,
        equipmentId,
        plannedStartTime,
        plannedEndTime,
        hazardsIdentified,
        ppeRequired,
        precautionsChecklist,
        typeSpecificData,
        isDraft,
      } = body;

      if (!type || !workDescription || !plantId || !areaId || !equipmentId) {
        return NextResponse.json(
          { error: "Missing required permit fields." },
          { status: 400 }
        );
      }

      const startDate = new Date(plannedStartTime);
      const endDate = new Date(plannedEndTime);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format for validity window." },
          { status: 400 }
        );
      }

      if (startDate >= endDate) {
        return NextResponse.json(
          { error: "Planned start time must be before planned end time." },
          { status: 400 }
        );
      }

      // Real-time conflict collision detection check
      const conflictResult = await detectPermitConflicts({
        type,
        areaId,
        plannedStartTime: startDate,
        plannedEndTime: endDate,
      });

      const count = await prisma.permit.count();
      const permitNumber = `PTW-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
      const initialStatus = isDraft ? "DRAFT" : "PENDING_APPROVAL";

      const area = await prisma.area.findUnique({
        where: { id: areaId },
        include: { owner: true },
      });

      const safetyOfficer = await prisma.user.findFirst({
        where: { role: "SAFETY_OFFICER" },
      });

      const areaOwnerId =
        area?.ownerId || (await prisma.user.findFirst({ where: { role: "AREA_OWNER" } }))?.id;

      const permit = await prisma.permit.create({
        data: {
          permitNumber,
          type,
          status: initialStatus,
          requesterId: currentUser.id,
          contractorName: contractorName || currentUser.name,
          workDescription,
          plantId,
          areaId,
          equipmentId,
          plannedStartTime: startDate,
          plannedEndTime: endDate,
          hazardsIdentified: JSON.stringify(hazardsIdentified || []),
          ppeRequired: JSON.stringify(ppeRequired || []),
          precautionsChecklist: JSON.stringify(precautionsChecklist || []),
          typeSpecificData: JSON.stringify(typeSpecificData || {}),
          approvals:
            initialStatus === "PENDING_APPROVAL" && areaOwnerId && safetyOfficer
              ? {
                  create: [
                    { approverId: areaOwnerId, roleRequired: "AREA_OWNER", status: "PENDING" },
                    { approverId: safetyOfficer.id, roleRequired: "SAFETY_OFFICER", status: "PENDING" },
                  ],
                }
              : undefined,
          auditLogs: {
            create: [
              {
                action: isDraft ? "CREATED" : "SUBMITTED",
                performedById: currentUser.id,
                fromStatus: null,
                toStatus: initialStatus,
                comment: isDraft
                  ? "Permit draft created."
                  : `Permit submitted for approvals. ${
                      conflictResult.hasConflict ? "⚠️ Caution: Safety collision detected." : ""
                    }`,
              },
            ],
          },
        },
        include: {
          plant: true,
          area: true,
          equipment: true,
        },
      });

      return NextResponse.json({
        permit,
        conflictWarning: conflictResult.hasConflict ? conflictResult.conflictingPermits : null,
      });
    } catch (error: any) {
      console.error("PermitController.createPermit error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create permit." },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/permits/[id]/transition
   * Mission-critical server-side State Machine enforcement.
   */
  async transitionPermit(req: NextRequest, id: string) {
    try {
      const currentUser = await getCurrentUser(req);
      const body = await req.json();

      const {
        action,
        comments,
        rejectionReason,
        suspensionReason,
        closureNotes,
        verificationNotes,
        signatureData,
      }: {
        action: StateTransitionAction;
        comments?: string;
        rejectionReason?: string;
        suspensionReason?: string;
        closureNotes?: string;
        verificationNotes?: string;
        signatureData?: string;
      } = body;

      if (!action) {
        return NextResponse.json({ error: "Action is required." }, { status: 400 });
      }

      const permit = await prisma.permit.findUnique({
        where: { id },
        include: {
          area: true,
          approvals: true,
        },
      });

      if (!permit) {
        return NextResponse.json({ error: "Permit not found." }, { status: 404 });
      }

      // Validate through the pure deterministic State Machine Engine
      const validation = validateStateTransition(
        {
          id: permit.id,
          permitNumber: permit.permitNumber,
          type: permit.type as any,
          status: permit.status as PermitStatus,
          requesterId: permit.requesterId,
          areaId: permit.areaId,
          area: permit.area ? { id: permit.area.id, ownerId: permit.area.ownerId } : undefined,
          plannedStartTime: permit.plannedStartTime,
          plannedEndTime: permit.plannedEndTime,
          actualStartTime: permit.actualStartTime,
          actualEndTime: permit.actualEndTime,
          approvals: permit.approvals.map((a) => ({
            id: a.id,
            approverId: a.approverId,
            roleRequired: a.roleRequired as Role,
            status: a.status as "PENDING" | "APPROVED" | "REJECTED",
            comments: a.comments,
          })),
        },
        action,
        currentUser,
        {
          rejectionReason,
          comments,
        }
      );

      if (!validation.allowed || !validation.nextStatus) {
        return NextResponse.json(
          { error: validation.error || "Illegal state transition attempted." },
          { status: 400 }
        );
      }

      const nextStatus = validation.nextStatus;
      const now = new Date();

      const updateData: any = { status: nextStatus };
      if (action === "ACTIVATE") updateData.actualStartTime = now;
      if (action === "CLOSE") {
        updateData.actualEndTime = now;
        if (closureNotes) updateData.closureNotes = closureNotes;
      }
      if (action === "VERIFY_CLOSURE" && verificationNotes) {
        updateData.verificationNotes = verificationNotes;
      }
      if (action === "REJECT" && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      if (action === "SUSPEND" && suspensionReason) {
        updateData.suspensionReason = suspensionReason;
      }
      if (signatureData) {
        updateData.signatureData = signatureData;
      }

      // Atomic Transaction: Update Permit + Update Approval + Write Immutable Audit Log
      await prisma.$transaction(async (tx) => {
        if (action === "APPROVE" || action === "REJECT") {
          const approvalRecord = permit.approvals.find(
            (a) =>
              a.roleRequired === currentUser.role ||
              (currentUser.role === "ADMIN" && a.status === "PENDING")
          );

          if (approvalRecord) {
            await tx.approval.update({
              where: { id: approvalRecord.id },
              data: {
                status: action === "APPROVE" ? "APPROVED" : "REJECTED",
                comments: comments || (action === "REJECT" ? rejectionReason : "Approved"),
                signatureData: signatureData || null,
                signedAt: now,
              },
            });
          }
        }

        await tx.permit.update({
          where: { id: permit.id },
          data: updateData,
        });

        await tx.permitAuditLog.create({
          data: {
            permitId: permit.id,
            action,
            performedById: currentUser.id,
            fromStatus: permit.status,
            toStatus: nextStatus,
            comment:
              comments ||
              rejectionReason ||
              suspensionReason ||
              closureNotes ||
              verificationNotes ||
              `Transitioned permit from ${permit.status} to ${nextStatus}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: `Permit transitioned to ${nextStatus}`,
        nextStatus,
      });
    } catch (error: any) {
      console.error("PermitController.transitionPermit error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to process transition." },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/permits/[id]/extend
   * Extension request and Safety Officer re-approval flow.
   */
  async extendPermit(req: NextRequest, id: string) {
    try {
      const currentUser = await getCurrentUser(req);
      const body = await req.json();
      const { extensionHours, reason } = body;

      if (!extensionHours || extensionHours <= 0 || extensionHours > 12) {
        return NextResponse.json(
          { error: "Extension hours must be between 1 and 12 hours." },
          { status: 400 }
        );
      }

      if (!reason || reason.trim().length === 0) {
        return NextResponse.json(
          { error: "A valid justification is required for permit extension." },
          { status: 400 }
        );
      }

      const permit = await prisma.permit.findUnique({ where: { id } });

      if (!permit) {
        return NextResponse.json({ error: "Permit not found." }, { status: 404 });
      }

      if (permit.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Extension can only be requested for an currently ACTIVE permit." },
          { status: 400 }
        );
      }

      const isSafetyOrAdmin =
        currentUser.role === "SAFETY_OFFICER" || currentUser.role === "ADMIN";

      if (isSafetyOrAdmin) {
        const newEndTime = new Date(
          permit.plannedEndTime.getTime() + extensionHours * 3600 * 1000
        );

        await prisma.$transaction([
          prisma.permit.update({
            where: { id: permit.id },
            data: {
              plannedEndTime: newEndTime,
              extensionRequestedHours: extensionHours,
              extensionReason: reason,
              extensionApproved: true,
            },
          }),
          prisma.permitAuditLog.create({
            data: {
              permitId: permit.id,
              action: "EXTENDED",
              performedById: currentUser.id,
              fromStatus: permit.status,
              toStatus: permit.status,
              comment: `Permit validity extended by +${extensionHours} hours to ${newEndTime.toISOString()}. Justification: ${reason}`,
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message: `Permit extended by +${extensionHours} hours.`,
          newEndTime,
        });
      } else {
        await prisma.$transaction([
          prisma.permit.update({
            where: { id: permit.id },
            data: {
              extensionRequestedHours: extensionHours,
              extensionReason: reason,
              extensionApproved: false,
            },
          }),
          prisma.permitAuditLog.create({
            data: {
              permitId: permit.id,
              action: "EXTENSION_REQUESTED",
              performedById: currentUser.id,
              fromStatus: permit.status,
              toStatus: permit.status,
              comment: `Requester requested +${extensionHours} hrs extension. Reason: ${reason}`,
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message: "Extension request submitted for Safety Officer re-approval.",
        });
      }
    } catch (error: any) {
      console.error("PermitController.extendPermit error:", error);
      return NextResponse.json({ error: "Failed to process extension." }, { status: 500 });
    }
  }

  /**
   * GET /api/permits/[id]/qrcode
   * Generates dynamic verification QR code data URL.
   */
  async generatePermitQrCode(req: NextRequest, id: string) {
    try {
      const permit = await prisma.permit.findUnique({
        where: { id },
        select: { id: true, permitNumber: true, status: true, type: true },
      });

      if (!permit) {
        return NextResponse.json({ error: "Permit not found" }, { status: 404 });
      }

      const host = req.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      const verificationUrl = `${protocol}://${host}/permits/${permit.id}`;

      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 280,
        margin: 2,
        color: { dark: "#0F172A", light: "#FFFFFF" },
      });

      return NextResponse.json({
        permitNumber: permit.permitNumber,
        url: verificationUrl,
        qrDataUrl,
      });
    } catch (error: any) {
      console.error("PermitController.generatePermitQrCode error:", error);
      return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
    }
  }
}

export const permitController = new PermitController();
