import type { calendar_v3 } from "googleapis"
import type { CredentialCredential } from "../credentials/google-calendar-oauth2"
import { createCalendarClient } from "./calendar-client"

const ERROR_MSG = "Missing Google Calendar credential. Please configure and authorize the Google Calendar OAuth credential."

export function requireCalendarClient(
  credentials: Record<string, unknown> | undefined,
  credentialKey: string,
): calendar_v3.Calendar {
  const cred = credentials?.[credentialKey] as CredentialCredential | undefined
  if (!cred?.access_token) {
    throw new Error(ERROR_MSG)
  }
  return createCalendarClient(cred)
}