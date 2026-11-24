// ==============================================================================
// OPMAINT CMMS - AUTHENTICATION & RBAC RESOLVER
// Supports JWT session token and 1-Click Demo Persona Switcher
// ==============================================================================

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/backend/db/prisma";
import { UserContext } from "@/backend/services/stateMachine";
import { Role } from "@/backend/types";

const JWT_SECRET = process.env.JWT_SECRET || "opmaint-super-secret-safety-key-2026";

export function signToken(user: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: Role;
      name: string;
    };
  } catch {
    return null;
  }
}

/**
 * Resolves current user context from:
 * 1. `x-user-role` or `x-user-id` header (used by Demo Quick Role Switcher)
 * 2. `auth_token` cookie
 * 3. Default fallback to Requester (Murugan Technician)
 */
export async function getCurrentUser(req?: NextRequest): Promise<UserContext> {
  // 1. Check custom headers (used by Quick Role Switcher in UI)
  const headerUserId = req?.headers.get("x-user-id");
  const headerRole = req?.headers.get("x-user-role");

  if (headerUserId) {
    const user = await prisma.user.findUnique({ where: { id: headerUserId } });
    if (user) {
      return {
        id: user.id,
        role: user.role as Role,
        name: user.name,
        email: user.email,
      };
    }
  }

  if (headerRole) {
    const user = await prisma.user.findFirst({ where: { role: headerRole } });
    if (user) {
      return {
        id: user.id,
        role: user.role as Role,
        name: user.name,
        email: user.email,
      };
    }
  }

  // 2. Check Cookie
  const cookieToken = req?.cookies.get("auth_token")?.value;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) {
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (user) {
        return {
          id: user.id,
          role: user.role as Role,
          name: user.name,
          email: user.email,
        };
      }
    }
  }

  // 3. Fallback to default Requester user
  const defaultUser = await prisma.user.findFirst({ where: { role: "REQUESTER" } });
  if (defaultUser) {
    return {
      id: defaultUser.id,
      role: defaultUser.role as Role,
      name: defaultUser.name,
      email: defaultUser.email,
    };
  }

  return {
    id: "user-req-1",
    role: "REQUESTER",
    name: "Murugan Technician",
    email: "requester@opmaint.com",
  };
}
