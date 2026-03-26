import { z } from "zod"
import { parseParameters } from "./parse-zod"
import { createSheetsClient, type SheetsClient } from "./sheets-client"

export type GoogleSheetsOAuthCredential = {
  access_token?: string
}

const parametersForCredentialSchema = z.object({
  credential_id: z.string().trim().min(1, "credential_id must not be empty"),
})

export function resolveCredential(args: {
  parameters: Record<string, unknown>
  credentials: Record<string, unknown>
}): { credentialId: string; accessToken: string; sheets: SheetsClient } {
  const { credential_id: credentialId } = parseParameters(
    parametersForCredentialSchema,
    args.parameters ?? {},
  )

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
