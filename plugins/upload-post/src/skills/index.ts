import getUploadStatus from "./tools/get-upload-status"
import uploadMedia from "./tools/upload-media"

const skills: Record<string, string> = {
  "get-upload-status": getUploadStatus,
  "upload-media": uploadMedia,
}

export function getSkill(toolName: string): string | undefined {
  return skills[toolName]
}
