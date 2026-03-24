import { createSheetsClient, type SheetsClient } from "./sheets-client"

export type GoogleSheetsOAuthCredential = {
  access_token?: string
}

export function resolveCredential(args: {
  parameters: Record<string, unknown>
  credentials: Record<string, unknown>
}): { credentialId: string; accessToken: string; sheets: SheetsClient } {
  const p = args.parameters ?? {}
  const credentialId =
    typeof p.credential_id === "string" ? p.credential_id.trim() : ""
  if (!credentialId) {
    throw new Error("Missing credential_id")
  }

  const credentials = args.credentials ?? {}
  const cred = credentials[credentialId] as
    | GoogleSheetsOAuthCredential
    | undefined
  if (!cred) {
    throw new Error(
      "Google Sheets credential not found. Please select a valid credential.",
    )
  }

  if (typeof cred.access_token !== "string" || cred.access_token.length === 0) {
    throw new Error("Google Sheets credential missing access_token")
  }

  return {
    credentialId,
    accessToken: cred.access_token,
    sheets: createSheetsClient(cred.access_token),
  }
}
