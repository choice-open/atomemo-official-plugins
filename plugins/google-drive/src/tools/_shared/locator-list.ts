import type { ToolLocatorListFunction } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { googleDriveRequest } from "../../transport"
import { resolveDriveId } from "./resolve"

type GoogleDriveOAuthCredential = {
  access_token?: string
}

type LocatorCtx = Parameters<ToolLocatorListFunction>[0]
type SearchMode = "drives" | "files" | "folders"

const LOCATOR_PAGE_SIZE = 50

function getAccessToken(
  credentials: Record<string, unknown>,
  credentialId: string | undefined,
): string | undefined {
  if (!credentialId) return undefined
  const cred = credentials[credentialId] as
    | GoogleDriveOAuthCredential
    | undefined
  if (typeof cred?.access_token === "string" && cred.access_token.length > 0) {
    return cred.access_token
  }
  return undefined
}

function normalizeFilter(filter?: string | null): string | undefined {
  const trimmed = filter?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

async function searchDriveItems(
  input: LocatorCtx,
  mode: SearchMode,
): ReturnType<ToolLocatorListFunction> {
  const { credentials, filter, parameters, pagination_token } = input
  const credentialId =
    typeof parameters.credential_id === "string"
      ? parameters.credential_id.trim()
      : undefined
  const accessToken = getAccessToken(credentials ?? {}, credentialId)
  if (!accessToken) return { results: [] }

  const searchFilter = normalizeFilter(filter)
  if (mode === "drives") {
    const res = await googleDriveRequest(accessToken, "GET", "/drive/v3/drives", {
      qs: {
        q: searchFilter
          ? `name contains '${searchFilter.replace(/'/g, "\\'")}'`
          : undefined,
        pageToken: pagination_token ?? undefined,
        pageSize: LOCATOR_PAGE_SIZE,
      },
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      throw new Error(`Google Drive search failed (HTTP ${res.status}). ${errText}`)
    }

    const data = (await res.json()) as {
      drives?: Array<{ id?: string; name?: string }>
      nextPageToken?: string
    }

    const results =
      data.drives?.map((drive) => ({
        label: drive.name ?? drive.id ?? "",
        value: drive.id ?? "",
        url: drive.id
          ? `https://drive.google.com/drive/folders/${drive.id}`
          : null,
      })) ?? []

    return {
      results,
      pagination_token: data.nextPageToken ?? null,
    }
  }

  const qParts =
    mode === "folders"
      ? [
          "mimeType = 'application/vnd.google-apps.folder'",
          "trashed = false",
        ]
      : [
          "mimeType != 'application/vnd.google-apps.folder'",
          "trashed = false",
        ]

  if (searchFilter) {
    qParts.push(`name contains '${searchFilter.replace(/'/g, "\\'")}'`)
  }

  const driveId = resolveDriveId(parameters)
  const res = await googleDriveRequest(accessToken, "GET", "/drive/v3/files", {
    qs: {
      q: qParts.join(" and "),
      fields: "files(id,name,webViewLink),nextPageToken",
      pageSize: LOCATOR_PAGE_SIZE,
      pageToken: pagination_token ?? undefined,
      corpora: driveId ? "drive" : "allDrives",
      driveId,
      orderBy: "name_natural",
      spaces: "appDataFolder,drive",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Google Drive search failed (HTTP ${res.status}). ${errText}`)
  }

  const data = (await res.json()) as {
    files?: Array<{ id?: string; name?: string; webViewLink?: string }>
    nextPageToken?: string
  }

  const results =
    data.files?.map((item) => ({
      label: item.name ?? item.id ?? "",
      value: item.id ?? "",
      url: item.webViewLink ?? null,
    })) ?? []

  return {
    results,
    pagination_token: data.nextPageToken ?? null,
  }
}

export const searchFilesMethod = {
  async search_files(input: LocatorCtx) {
    return searchDriveItems(input, "files")
  },
}

export const searchDrivesMethod = {
  async search_drives(input: LocatorCtx) {
    return searchDriveItems(input, "drives")
  },
}

export const searchFoldersMethod = {
  async search_folders(input: LocatorCtx) {
    return searchDriveItems(input, "folders")
  },
}
