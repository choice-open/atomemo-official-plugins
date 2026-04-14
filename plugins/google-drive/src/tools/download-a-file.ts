import type {
  FileRef,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_DRIVE_O_AUTH2_CREDENTIAL_NAME } from "../credentials/google-drive-oauth2"
import { t } from "../i18n/i18n-node"
import { googleDriveRequest } from "../transport"
import downloadAFileSkill from "./download-a-file-skill.md" with { type: "text" }
import { searchFilesMethod } from "./_shared/locator-list"
import { resolveFileId } from "./_shared/resolve"

type GoogleDriveOAuthCredential = {
  access_token?: string
}

/** Default export MIME types for Google Workspace native types (aligned with n8n). */
const GOOGLE_EXPORT_MIMES: Record<string, string> = {
  document: "text/html",
  spreadsheet: "text/csv",
  presentation:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  drawing: "image/jpeg",
}

type ParameterNames = "credential_id" | "file_id"

const parameters: Array<Property<ParameterNames>> = [
  {
    name: "credential_id",
    type: "credential_id",
    required: true,
    display_name: t("PARAM_CREDENTIAL_LABEL"),
    credential_name: GOOGLE_DRIVE_O_AUTH2_CREDENTIAL_NAME,
    ui: { component: "credential-select" },
  },
  {
    name: "file_id",
    type: "resource_locator",
    required: true,
    display_name: t("DOWNLOAD_FILE_PARAM_FILE_ID_LABEL"),
    ai: { llm_description: t("DOWNLOAD_FILE_PARAM_FILE_ID_HINT") },
    modes: [
      {
        type: "list",
        search_list_method: "search_files",
        searchable: true,
        placeholder: t("DOWNLOAD_FILE_PARAM_FILE_ID_MODE_LIST_PLACEHOLDER"),
      },
      {
        type: "url",
        placeholder: t("DOWNLOAD_FILE_PARAM_FILE_ID_MODE_URL_PLACEHOLDER"),
        extract_value: {
          type: "regex",
          regex:
            "https://(?:drive|docs)\\.google\\.com/(?:file/d/|document/d/|spreadsheets/d/|presentation/d/|drawings/d/)([a-zA-Z0-9_-]+)|https://drive\\.google\\.com/open\\?id=([a-zA-Z0-9_-]+)",
        },
      },
      {
        type: "id",
        placeholder: t("DOWNLOAD_FILE_PARAM_FILE_ID_PLACEHOLDER"),
      },
    ],
    ui: { support_expression: true },
  },
]

function getAccessToken(cred: GoogleDriveOAuthCredential): string {
  if (typeof cred.access_token !== "string" || cred.access_token.length === 0) {
    throw new Error("Google Drive credential missing access_token")
  }
  return cred.access_token
}

function extensionFromFilename(filename: string): string | null {
  const parts = filename.split(".")
  if (parts.length < 2) return null
  const ext = (parts.pop() ?? "").toLowerCase()
  return ext || null
}

export const downloadAFileTool: ToolDefinition = {
  name: "google-drive-download-file",
  display_name: t("DOWNLOAD_FILE_TOOL_DISPLAY_NAME"),
  description: t("DOWNLOAD_FILE_TOOL_DESCRIPTION"),
  skill: downloadAFileSkill,
  icon: "⬇️",
  parameters,
  locator_list: searchFilesMethod,
  invoke: async ({ args, context }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId =
      typeof p.credential_id === "string" ? p.credential_id.trim() : undefined
    if (!credentialId) throw new Error("Missing credential_id")

    const credentials = args.credentials ?? {}
    const cred = credentials[credentialId] as
      | GoogleDriveOAuthCredential
      | undefined
    if (!cred) {
      throw new Error(
        "Google Drive credential not found. Please select a valid credential.",
      )
    }

    const fileId = resolveFileId(p)
    if (!fileId) throw new Error("Missing file_id")

    const accessToken = getAccessToken(cred)

    // 1. Get file metadata (mimeType, name)
    const metaRes = await googleDriveRequest(
      accessToken,
      "GET",
      "/drive/v3/files/" + encodeURIComponent(fileId),
      {
        qs: {
          fields: "mimeType,name",
          supportsTeamDrives: true,
          supportsAllDrives: true,
        },
      },
    )
    if (!metaRes.ok) {
      const errText = await metaRes.text().catch(() => "")
      throw new Error(
        `Google Drive metadata failed (HTTP ${metaRes.status}). ${errText}`,
      )
    }
    const file = (await metaRes.json()) as { mimeType?: string; name?: string }
    const mimeType = file.mimeType ?? ""
    const name = file.name ?? "download"

    let res: Response
    if (mimeType.includes("vnd.google-apps")) {
      // 2a. Google Workspace native file → export with conversion
      const typePart = mimeType.split(".").pop() ?? ""
      const exportMime =
        GOOGLE_EXPORT_MIMES[typePart] ?? "application/octet-stream"
      res = await googleDriveRequest(
        accessToken,
        "GET",
        "/drive/v3/files/" + encodeURIComponent(fileId) + "/export",
        {
          qs: {
            mimeType: exportMime,
            supportsAllDrives: true,
          },
        },
      )
    } else {
      // 2b. Regular file → alt=media
      res = await googleDriveRequest(
        accessToken,
        "GET",
        "/drive/v3/files/" + encodeURIComponent(fileId),
        {
          qs: {
            alt: "media",
            supportsAllDrives: true,
          },
        },
      )
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      throw new Error(
        `Google Drive download failed (HTTP ${res.status}). ${errText}`,
      )
    }

    const arrayBuffer = await res.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const contentBase64 = Buffer.from(bytes).toString("base64")

    const contentType =
      (res.headers.get("content-type")?.split(";")[0]?.trim() ?? mimeType) ||
      "application/octet-stream"
    const filename = name
    const extension = extensionFromFilename(filename)

    const fileRef: FileRef = {
      __type__: "file_ref",
      source: "mem",
      filename,
      content: contentBase64,
      mime_type: contentType,
      extension,
      size: bytes.length,
      res_key: null,
      remote_url: null,
    }
    console.log("fileRef", fileRef)

    const uploadResult = await context.files.upload(fileRef, {})
    return uploadResult
  },
}
