/** Convert Gmail base64url to standard base64 */
export function base64UrlToBase64(base64url: string): string {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  const padding = base64.length % 4
  if (padding) {
    base64 += "=".repeat(4 - padding)
  }
  return base64
}
