import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { base64UrlToBase64 } from "../lib/base64"
import { requireGmailClient } from "../lib/require-gmail"
import {
  gmailCredentialParam,
  userIdParam,
  messageIdParam,
} from "./_shared/parameters"
import { getMimeFromBase64 } from "../lib/mime-type"
import downloadAttachmentSkill from "./download-attachment-skill.md" with { type: "text" }

export const downloadAttachmentTool: ToolDefinition = {
  name: "gmail-download-attachment",
  display_name: t("GMAIL_TOOL_DOWNLOAD_ATTACHMENT_DISPLAY_NAME"),
  description: t("GMAIL_TOOL_DOWNLOAD_ATTACHMENT_DESCRIPTION"),
  skill: downloadAttachmentSkill,
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
        hint: t("GMAIL_PARAM_ATTACHMENT_ID_HINT"),
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

    const { mime, ext } = await getMimeFromBase64(content)

    const fileRef = {
      __type__: "file_ref" as const,
      source: "mem" as const,
      filename,
      extension: ext,
      mime_type: mime,
      size,
      res_key: null as string | null,
      remote_url: null as string | null,
      content: content || null,
    }

    const uploaded = await context.files.upload(fileRef, {})
    return { file: uploaded } as any
  },
}
