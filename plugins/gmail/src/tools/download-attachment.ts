import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { base64UrlToBase64 } from "../lib/base64"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  messageIdParam,
} from "./_shared/parameters"

/** Derive file extension from MIME type (e.g. application/pdf -> pdf) */
function extensionFromMimeType(mimeType: string): string | null {
  const subtype = mimeType.split("/")[1]?.split("+")[0]?.toLowerCase()
  if (!subtype || subtype === "octet-stream") return null
  const map: Record<string, string> = { jpeg: "jpg" }
  return map[subtype] ?? subtype
}

export const downloadAttachmentTool: ToolDefinition = {
  name: "gmail-download-attachment",
  display_name: t("GMAIL_TOOL_DOWNLOAD_ATTACHMENT_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_DOWNLOAD_ATTACHMENT_DESCRIPTION"),
  icon: "📎",
  parameters: [
    gmailCredentialParam,
    userIdParam,
    messageIdParam,
    {
      name: "attachment_id",
      type: "string",
      required: true,
      display_name: t("GMAIL_PARAM_ATTACHMENT_ID_LABEL"),
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "filename",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_FILENAME_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_FILENAME_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "mime_type",
      type: "string",
      required: false,
      display_name: t("GMAIL_PARAM_MIME_TYPE_LABEL"),
      ui: {
        component: "input",
        hint: t("GMAIL_PARAM_MIME_TYPE_HINT"),
        support_expression: true,
        width: "medium",
      },
    },
  ],
  async invoke({ args, context }) {
    const gmail = requireGmailClient(
      args.credentials,
      args.parameters.gmail_credential,
    )
    const userId = args.parameters.user_id ?? "me"
    const res = await gmail.users.messages.attachments.get({
      userId,
      messageId: args.parameters.message_id,
      id: args.parameters.attachment_id,
    })

    const data = res.data.data ?? ""
    const size = res.data.size ?? 0
    const attachmentId = res.data.attachmentId ?? args.parameters.attachment_id
    const filename =
      args.parameters.filename?.trim() || `attachment-${attachmentId}`

    const content = data ? base64UrlToBase64(data) : ""

    const mimeType =
      args.parameters.mime_type?.trim() || "application/octet-stream"
    const extensionFromFilename = filename.includes(".")
      ? filename.slice(filename.lastIndexOf(".") + 1)
      : null
    const extension =
      extensionFromFilename ?? extensionFromMimeType(mimeType)

    const fileRef = {
      __type__: "file_ref" as const,
      source: "mem" as const,
      filename,
      extension,
      mime_type: mimeType,
      size,
      res_key: null as string | null,
      remote_url: null as string | null,
      content: content || null,
    }

    const uploaded = await context.files.upload(fileRef, {})
    return { file: uploaded } as any
  },
}
