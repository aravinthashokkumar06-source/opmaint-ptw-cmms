import { NextRequest } from "next/server";
import { metadataController } from "@/backend/controllers/metadataController";

export async function GET(req: NextRequest) {
  return metadataController.getMetadata(req);
}
