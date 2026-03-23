import { google } from "googleapis"
import type { CredentialCredential } from "../credentials/google-calendar-oauth2"

export function createCalendarClient(cred: CredentialCredential) {
  const oauth2Client = new google.auth.OAuth2(
    cred.client_id || "",
    cred.client_secret || "",
  )
  oauth2Client.setCredentials({
    access_token: cred.access_token,
    refresh_token: cred.refresh_token,
  })
  if (cred.refresh_token && cred.client_id && cred.client_secret) {
    oauth2Client.on("tokens", () => {})
  }
  return google.calendar({ version: "v3", auth: oauth2Client })
}

export function getCalendarClientFromArgs(
  credentials: Record<string, unknown> | undefined,
  credentialKey: string,
) {
  const cred = credentials?.[credentialKey] as CredentialCredential | undefined
  if (!cred?.access_token) {
    return null
  }
  return createCalendarClient(cred)
}
