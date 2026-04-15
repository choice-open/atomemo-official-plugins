import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  createFeishuLarkClient,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import im_upload_fileSkill from "./im-upload-file-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_upload_file",
  module: "im",
  name: "上传文件",
  method: "POST",
  path: "/open-apis/im/v1/files",
}

const FILE_TYPES = [
  "opus",
  "mp4",
  "pdf",
  "doc",
  "xls",
  "ppt",
  "stream",
] as const

function readFileType(
  p: Record<string, unknown>,
): (typeof FILE_TYPES)[number] {
  const v = p.file_type
  if (v === undefined || v === null || v === "") {
    return "stream"
  }
  if (typeof v === "string" && (FILE_TYPES as readonly string[]).includes(v)) {
    return v as (typeof FILE_TYPES)[number]
  }
  throw new Error(
    `Parameter \`file_type\` must be one of: ${FILE_TYPES.join(", ")}.`,
  )
}

function pickOptionalFileName(p: Record<string, unknown>): string | undefined {
  const v = p.file_name
  if (typeof v !== "string") return undefined
  const s = v.trim()
  return s === "" ? undefined : s
}

export const feishuImUploadFileTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Upload file",
    zh_Hans: "上传文件",
  },
  description: {
    en_US:
      "Upload a file to the Feishu Open Platform using a workflow file_ref (multipart).",
    zh_Hans: "通过 workflow file_ref 将文件以 multipart 方式上传至飞书开放平台。",
  },
  skill: im_upload_fileSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "file",
      type: "file_ref",
      required: true,
      display_name: t("IM_FILE_REF_DISPLAY_NAME"),
      ai: {
        llm_description: t("IM_FILE_REF_AI_DESCRIPTION"),
      },
      ui: {
        hint: t("IM_FILE_REF_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"file">,
    {
      name: "file_type",
      type: "string",
      required: false,
      display_name: t("IM_FILE_TYPE_PARAM_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("IM_FILE_TYPE_PARAM_HINT"),
        placeholder: {
          en_US: "stream",
          zh_Hans: "stream",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"file_type">,
    {
      name: "file_name",
      type: "string",
      required: false,
      display_name: t("IM_FILE_NAME_PARAM_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("IM_FILE_NAME_PARAM_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"file_name">,
  ],
  invoke: async ({ args, context }): Promise<JsonValue> => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    if (!p.file) {
      throw new Error("Parameter `file` is required.")
    }
    if (!context?.files) {
      throw new Error("File context is unavailable.")
    }

    const fileRef = context.files.parseFileRef(p.file as never)
    const downloaded = await context.files.download(fileRef)
    const fileBuffer = Buffer.from(downloaded.content ?? "", "base64")
    if (fileBuffer.length === 0) {
      throw new Error("Failed to read file bytes from file_ref (empty content).")
    }

    const fileType = readFileType(p)
    const nameFromParam = pickOptionalFileName(p)
    const fileName =
      nameFromParam ?? (downloaded.filename?.trim() || "upload.bin")

    const client = createFeishuLarkClient(args.credentials, credentialId)
    const result = await client.im.file.create({
      data: {
        file_type: fileType,
        file_name: fileName,
        file: fileBuffer,
      },
    })

    return result as JsonValue
  },
}
