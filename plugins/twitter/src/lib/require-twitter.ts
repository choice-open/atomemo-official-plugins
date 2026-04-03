import { Client } from "@xdevplatform/xdk"
import type { TwitterCredential } from "../credentials/twitter-oauth"

const ERROR_MSG =
  "Missing Twitter credential. Please configure Twitter OAuth credential."

export function requireTwitterClient(
  credentials: Record<string, unknown> | undefined,
  credentialKey: string,
): Client {
  const cred = credentials?.[credentialKey] as TwitterCredential | undefined
  if (!cred?.access_token) {
    throw new Error(ERROR_MSG)
  }
  return new Client({ accessToken: cred.access_token })
}
