const FILE_URL_REGEX =
  /https:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/|document\/d\/|spreadsheets\/d\/|presentation\/d\/|drawings\/d\/)([a-zA-Z0-9_-]+)/
const FOLDER_URL_REGEX =
  /https:\/\/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/
const DRIVE_URL_REGEX =
  /https:\/\/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/
const OPEN_URL_REGEX = /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/

type ResourceLocatorLike = {
  __type__?: unknown
  value?: unknown
}

function getLocatorRawValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  if (!value || typeof value !== "object") {
    return undefined
  }

  const locator = value as ResourceLocatorLike
  if (locator.__type__ !== "resource_locator" || typeof locator.value !== "string") {
    return undefined
  }

  const trimmed = locator.value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function extractLocatorValue(
  value: unknown,
  urlRegex: RegExp,
): string | undefined {
  const rawValue = getLocatorRawValue(value)
  if (!rawValue) return undefined

  const fromPrimary = rawValue.match(urlRegex)?.[1]?.trim()
  if (fromPrimary) return fromPrimary

  const fromOpen = rawValue.match(OPEN_URL_REGEX)?.[1]?.trim()
  if (fromOpen) return fromOpen

  return rawValue
}

export function resolveFileId(
  parameters: Record<string, unknown>,
): string | undefined {
  return extractLocatorValue(parameters.file_id, FILE_URL_REGEX)
}

export function resolveFolderId(
  parameters: Record<string, unknown>,
): string | undefined {
  return extractLocatorValue(parameters.folder_id, FOLDER_URL_REGEX)
}

export function resolveDriveId(
  parameters: Record<string, unknown>,
): string | undefined {
  return extractLocatorValue(parameters.drive_id, DRIVE_URL_REGEX)
}
