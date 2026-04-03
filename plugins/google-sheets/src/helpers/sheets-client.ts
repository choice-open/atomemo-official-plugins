import { sheets as sheetsApi } from "@googleapis/sheets"
import { OAuth2Client } from "google-auth-library"

export type SheetsClient = ReturnType<typeof sheetsApi>

export function createSheetsClient(accessToken: string): SheetsClient {
  const auth = new OAuth2Client()
  auth.setCredentials({ access_token: accessToken })
  return sheetsApi({ version: "v4", auth })
}
