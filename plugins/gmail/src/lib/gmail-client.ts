import { google } from "googleapis"
import type { GmailCredential } from "../credentials/gmail-oauth"

export function createGmailClient(cred: GmailCredential) {
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
  return google.gmail({ version: "v1", auth: oauth2Client })
}

export function getGmailClientFromArgs(
  credentials: Record<string, unknown> | undefined,
  credentialKey: string,
) {
  const cred = credentials?.[credentialKey] as GmailCredential | undefined
  if (!cred?.access_token) {
    return null
  }
  return createGmailClient(cred)
}
