/**
 * Helpers aligned with n8n Drive v2 (e.g. setParentFolder for upload parent).
 */

/**
 * Resolve parent for upload: folder takes precedence, then drive root, then none.
 * Mirrors n8n's setParentFolder; we use optional strings (no RLC defaults).
 */
export function setParentFolder(
  folderId: string | undefined,
  driveId: string | undefined,
): string | undefined {
  if (folderId?.trim()) return folderId.trim()
  if (driveId?.trim()) return driveId.trim()
  return undefined
}
