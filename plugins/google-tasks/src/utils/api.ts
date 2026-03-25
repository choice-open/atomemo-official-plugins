import { auth, tasks_v1 } from "@googleapis/tasks"

export function createTasksClient(accessToken: string): tasks_v1.Tasks {
  const oauth2Client = new auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })
  return new tasks_v1.Tasks({ auth: oauth2Client })
}

export function toJSON(data: unknown): Record<string, any> {
  return JSON.parse(JSON.stringify(data))
}

export function getAccessToken(args: {
  parameters: Record<string, any>
  credentials?: Record<string, any>
}): string {
  const credentialId = args.parameters.credential_id
  const credential = args.credentials?.[credentialId]
  const accessToken = credential?.access_token as string | undefined
  if (!accessToken) {
    throw new Error(
      "Missing access token. Please configure the Google Tasks OAuth2 credential.",
    )
  }
  return accessToken
}
