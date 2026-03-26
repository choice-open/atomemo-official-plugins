import { docs } from "@googleapis/docs"
import { OAuth2Client } from "google-auth-library"
import type { GoogleDocsCredential } from "../credentials/google-docs-oauth2"

export function createDocsClient(credential: GoogleDocsCredential) {
  const auth = new OAuth2Client(credential.client_id, credential.client_secret)
  auth.setCredentials({
    access_token: credential.access_token,
    refresh_token: credential.refresh_token,
  })
  return docs({ version: "v1", auth })
}

export function requireDocsClient(
  credentials: Record<string, unknown> | undefined,
  credentialKey: string,
) {
  const credential = credentials?.[credentialKey] as
    | GoogleDocsCredential
    | undefined
  if (!credential?.access_token) {
    throw new Error("缺少 Google Docs 凭证或 access_token")
  }
  return createDocsClient(credential)
}
