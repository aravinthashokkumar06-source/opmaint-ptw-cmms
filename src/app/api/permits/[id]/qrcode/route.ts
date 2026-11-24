import { NextRequest } from "next/server";
import { permitController } from "@/backend/controllers/permitController";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return permitController.generatePermitQrCode(req, params.id);
}
