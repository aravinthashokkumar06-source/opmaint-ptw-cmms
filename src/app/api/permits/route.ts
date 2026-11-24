import { NextRequest } from "next/server";
import { permitController } from "@/backend/controllers/permitController";

export async function GET(req: NextRequest) {
  return permitController.getPermits(req);
}

export async function POST(req: NextRequest) {
  return permitController.createPermit(req);
}
