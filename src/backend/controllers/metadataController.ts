// ==============================================================================
// OPMAINT CMMS - METADATA CONTROLLER
// Handles plant topology metadata, equipment lists, and demo auth personas
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/db/prisma";
import { getCurrentUser } from "@/backend/middleware/auth";

export class MetadataController {
  /**
   * GET /api/metadata
   * Returns plants, areas with owners, equipment, and current user session.
   */
  async getMetadata(req: NextRequest) {
    try {
      const currentUser = await getCurrentUser(req);

      const [plants, areas, equipment] = await Promise.all([
        prisma.plant.findMany({
          include: {
            areas: {
              include: {
                equipment: true,
                owner: { select: { id: true, name: true, email: true } },
              },
            },
          },
        }),
        prisma.area.findMany({
          include: {
            plant: true,
            equipment: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        }),
        prisma.equipment.findMany({
          include: {
            area: { include: { plant: true } },
          },
        }),
      ]);

      return NextResponse.json({
        currentUser,
        plants,
        areas,
        equipment,
      });
    } catch (error: any) {
      console.error("MetadataController.getMetadata error:", error);
      return NextResponse.json(
        { error: "Failed to fetch plant metadata." },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/auth/users
   * Returns the 4 demo users for the 1-Click Role Switcher.
   */
  async getDemoUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          department: true,
        },
      });

      return NextResponse.json({ users });
    } catch (error: any) {
      console.error("MetadataController.getDemoUsers error:", error);
      return NextResponse.json(
        { error: "Failed to fetch demo users." },
        { status: 500 }
      );
    }
  }
}

export const metadataController = new MetadataController();
