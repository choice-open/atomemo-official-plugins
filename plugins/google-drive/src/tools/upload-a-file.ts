import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_DRIVE_O_AUTH2_CREDENTIAL_NAME } from "../credentials/google-drive-oauth2"
import { setParentFolder } from "../helpers/utils"
import { t } from "../i18n/i18n-node"
import { googleDriveRequest } from "../transport"
import uploadAFileSkill from "./upload-a-file-skill.md" with { type: "text" }
import {
  searchDrivesMethod,
  searchFoldersMethod,
} from "./_shared/locator-list"
import { resolveDriveId, resolveFolderId } from "./_shared/resolve"

type GoogleDriveOAuthCredential = {
  access_token?: string
}

const UPLOAD_FIELDS =
  "id,name,mimeType,parents,webViewLink,webContentLink,size,createdTime,modifiedTime"

type ParametersNames =
  | "credential_id"
  | "file"
  | "file_name"
  | "drive_id"
  | "folder_id"

const parameters: Array<Property<ParametersNames>> = [
  {
    name: "credential_id",
    type: "credential_id",
    required: true,
    display_name: t("PARAM_CREDENTIAL_LABEL"),
    credential_name: GOOGLE_DRIVE_O_AUTH2_CREDENTIAL_NAME,
    ui: { component: "credential-select" },
  },
  {
    name: "file",
    type: "file_ref",
    required: true,
    display_name: t("PARAM_FILE_LABEL"),
  },
  {
    name: "file_name",
    type: "string",
    required: false,
    display_name: t("PARAM_FILE_NAME_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_FILE_NAME_HINT"),
      placeholder: t("PARAM_FILE_NAME_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
  {
    name: "drive_id",
    type: "resource_locator",
    required: false,
    display_name: t("PARAM_DRIVE_ID_LABEL"),
    ai: { llm_description: t("PARAM_DRIVE_ID_HINT") },
    modes: [
      {
        type: "list",
        search_list_method: "search_drives",
        searchable: true,
        placeholder: {
          en_US: "Search for a shared drive...",
          zh_Hans: "搜索共享云端硬盘...",
        },
      },
      {
        type: "url",
        placeholder: {
          en_US: "https://drive.google.com/drive/folders/0AxxxxxxxxxxxxxxxxxPVA",
          zh_Hans:
            "https://drive.google.com/drive/folders/0AxxxxxxxxxxxxxxxxxPVA",
        },
        extract_value: {
          type: "regex",
          regex:
            "https://drive\\.google\\.com/drive/(?:u/\\d+/)?folders/([a-zA-Z0-9_-]+)",
        },
      },
      {
        type: "id",
        placeholder: t("PARAM_DRIVE_ID_PLACEHOLDER"),
      },
    ],
    ui: {
      support_expression: true,
    },
  },
  {
    name: "folder_id",
    type: "resource_locator",
    required: false,
    display_name: t("PARAM_FOLDER_ID_LABEL"),
    ai: { llm_description: t("PARAM_FOLDER_ID_HINT") },
    modes: [
      {
        type: "list",
        search_list_method: "search_folders",
        searchable: true,
        placeholder: t("PARAM_FOLDER_ID_MODE_LIST_PLACEHOLDER"),
      },
      {
        type: "url",
        placeholder: t("PARAM_FOLDER_ID_MODE_URL_PLACEHOLDER"),
        extract_value: {
          type: "regex",
          regex:
            "https://drive\\.google\\.com/(drive/(?:u/\\d+/)?folders/([a-zA-Z0-9_-]+)|open\\?id=([a-zA-Z0-9_-]+))",
        },
      },
      {
        type: "id",
        placeholder: t("PARAM_FOLDER_ID_PLACEHOLDER"),
      },
    ],
    ui: { support_expression: true },
  },
]

function pickString(
  v: unknown,
  opts?: { trim?: boolean; nonEmpty?: boolean },
): string | undefined {
  if (typeof v !== "string") return undefined
  const s = opts?.trim === false ? v : v.trim()
  if (opts?.nonEmpty && s.length === 0) return undefined
  return s
}

function getAccessToken(cred: GoogleDriveOAuthCredential): string {
  if (typeof cred.access_token !== "string" || cred.access_token.length === 0) {
    throw new Error("Google Drive credential missing access_token")
  }
  return cred.access_token
}

function buildMultipartBody(input: {
  metadata: unknown
  fileBytes: Uint8Array
  mimeType: string
  boundary: string
}): Uint8Array {
  const encoder = new TextEncoder()
  const p1 = encoder.encode(
    `--${input.boundary}\r\ncontent-type: application/json; charset=utf-8\r\n\r\n${JSON.stringify(
      input.metadata,
    )}\r\n`,
  )
  const p2 = encoder.encode(
    `--${input.boundary}\r\ncontent-type: ${input.mimeType}\r\ncontent-transfer-encoding: binary\r\n\r\n`,
  )
  const p3 = encoder.encode(`\r\n--${input.boundary}--\r\n`)

  const out = new Uint8Array(
    p1.length + p2.length + input.fileBytes.length + p3.length,
  )
  out.set(p1, 0)
  out.set(p2, p1.length)
  out.set(input.fileBytes, p1.length + p2.length)
  out.set(p3, p1.length + p2.length + input.fileBytes.length)
  return out
}

export const uploadAFileTool: ToolDefinition = {
  name: "google-drive-upload-file",
  display_name: t("UPLOAD_FILE_TOOL_DISPLAY_NAME"),
  description: t("UPLOAD_FILE_TOOL_DESCRIPTION"),
  skill: uploadAFileSkill,
  icon: "⬆️",
  parameters,
  locator_list: { ...searchDrivesMethod, ...searchFoldersMethod },
  invoke: async ({ args, context }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId =
      typeof p.credential_id === "string" ? p.credential_id.trim() : undefined
    if (!credentialId) {
      throw new Error("Missing credential_id")
    }
    const credentials = args.credentials ?? {}
    const cred = credentials[credentialId] as
      | GoogleDriveOAuthCredential
      | undefined

    if (!cred) {
      throw new Error(
        "Google Drive credential not found. Please select a valid credential.",
      )
    }

    const driveId = resolveDriveId(p)
    const folderId = resolveFolderId(p)
    const fileNameParam = pickString(p.file_name, { nonEmpty: true })

    if (p.file === undefined) {
      throw new Error("Missing file")
    }
    const fileRef = context.files.parseFileRef(p.file)
    const downloaded = await context.files.download(fileRef)

    const originalFilename = downloaded.filename
    let driveFileName = fileNameParam ?? originalFilename ?? "upload"

    if (fileNameParam && originalFilename) {
      const dotIndex = originalFilename.lastIndexOf(".")
      if (dotIndex > 0 && dotIndex < originalFilename.length - 1) {
        const ext = originalFilename.slice(dotIndex)
        if (!fileNameParam.toLowerCase().endsWith(ext.toLowerCase())) {
          driveFileName = `${fileNameParam}${ext}`
        }
      }
    }
    const bytes = new Uint8Array(
      Buffer.from(downloaded.content ?? "", "base64"),
    )
    const mimeType =
      downloaded.mime_type?.split(";")[0]?.trim() ?? "application/octet-stream"

    const accessToken = getAccessToken(cred)
    const parentId = setParentFolder(folderId, driveId)

    const metadata: { name: string; parents?: string[] } = {
      name: driveFileName,
    }
    if (parentId) metadata.parents = [parentId]

    const boundary = `atomemo-${crypto.randomUUID()}`
    const body = buildMultipartBody({
      metadata,
      fileBytes: bytes,
      mimeType,
      boundary,
    })

    const res = await googleDriveRequest(
      accessToken,
      "POST",
      "/upload/drive/v3/files",
      {
        body,
        qs: {
          uploadType: "multipart",
          supportsAllDrives: true,
          fields: UPLOAD_FIELDS,
        },
        headers: {
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
      },
    )

    const json = (await res.json().catch(async () => ({
      error: await res.text().catch(() => ""),
    }))) as JsonValue

    if (!res.ok) {
      throw new Error(
        `Google Drive upload failed (HTTP ${res.status}). ${JSON.stringify(json)}`,
      )
    }

    return json
  },
}
