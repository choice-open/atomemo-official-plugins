import { docs } from "@googleapis/docs"
import { OAuth2Client } from "google-auth-library"
import type { GoogleDocsCredential } from "../credentials/google-docs-oauth2"
import { t } from "../i18n/i18n-node"

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


export const GoogleDocsCredentialParameter = {
  name: "google_credential",
  type: "credential_id" as const,
  required: true,
  display_name: t("GOOGLE_DOCS_CREDENTIAL_PARAM_DISPLAY_NAME"),
  credential_name: "google-docs-oauth2",
}