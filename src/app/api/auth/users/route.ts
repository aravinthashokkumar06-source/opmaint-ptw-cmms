import { metadataController } from "@/backend/controllers/metadataController";

export async function GET() {
  return metadataController.getDemoUsers();
}
