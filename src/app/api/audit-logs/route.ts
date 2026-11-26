import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const logs = await prisma.permitAuditLog.findMany({
      include: {
        permit: {
          select: {
            id: true,
            permitNumber: true,
            workDescription: true,
            type: true,
            status: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("GET /api/audit-logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliance audit logs" },
      { status: 500 }
    );
  }
}
