import { google } from "googleapis"
import type { calendar_v3 } from "googleapis"

export interface GoogleCalendarCredential {
  client_id: string
  client_secret: string
  access_token?: string
  refresh_token?: string
  expires_at?: number
}

export function createCalendarClient(cred: GoogleCalendarCredential): calendar_v3.Calendar {
  const oauth2Client = new google.auth.OAuth2(
    cred.client_id,
    cred.client_secret,
    undefined
  )

  oauth2Client.setCredentials({
    access_token: cred.access_token,
    refresh_token: cred.refresh_token,
    expiry_date: cred.expires_at ? cred.expires_at * 1000 : undefined,
  })

  return google.calendar({ version: "v3", auth: oauth2Client })
}
