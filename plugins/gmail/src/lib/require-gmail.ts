import type { gmail_v1 } from "googleapis"
import type { GmailCredential } from "../credentials/gmail-oauth"
import { createGmailClient } from "./gmail-client"

const ERROR_MSG = "Missing Gmail credential. Please configure Gmail OAuth credential."

export function requireGmailClient(
  credentials: Record<string, unknown> | undefined,
  credentialKey: string,
): gmail_v1.Gmail {
  const cred = credentials?.[credentialKey] as GmailCredential | undefined
  if (!cred?.access_token) {
    throw new Error(ERROR_MSG)
  }
  return createGmailClient(cred)
}
