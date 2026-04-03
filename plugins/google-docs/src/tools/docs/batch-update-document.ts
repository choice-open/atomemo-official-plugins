import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { GoogleDocsCredentialParameter, requireDocsClient } from "../../lib/docs-client"
import batchUpdateDocumentSkill from "./batch-update-document-skill.md" with { type: "text" }

export const batchUpdateDocumentTool: ToolDefinition = {
  name: "batch-update-document",
  display_name: t("BATCH_UPDATE_DOCUMENT_TOOL_DISPLAY_NAME"),
  description: t("BATCH_UPDATE_DOCUMENT_TOOL_DESCRIPTION"),
  skill: batchUpdateDocumentSkill,
  icon: "🛠️",
  parameters: [
    GoogleDocsCredentialParameter,
    {
      name: "document_id",
      type: "string",
      required: true,
      display_name: t("DOCUMENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("DOCUMENT_ID_PLACEHOLDER"),
        hint: t("DOCUMENT_ID_HINT"),
        support_expression: true,
      },
    },
    {
      name: "operation",
      type: "string",
      required: false,
      default: "raw_json",
      enum: ["raw_json", "insert_text", "replace_all_text", "update_text_style"],
      display_name: t("BATCH_OPERATION_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("BATCH_OPERATION_HINT"),
        support_expression: true,
      },
    },
    {
      name: "requests_json",
      type: "string",
      required: false,
      display_name: t("REQUESTS_JSON_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        width: "full",
        hint: t("REQUESTS_JSON_HINT"),
        placeholder: t("REQUESTS_JSON_PLACEHOLDER"),
        support_expression: true,
      },
      display: {
        hide: {
          operation: {
            $in: ["insert_text", "replace_all_text", "update_text_style"],
          },
        },
      },
    },
    {
      name: "insert_text",
      type: "string",
      required: false,
      display_name: t("INSERT_TEXT_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        width: "full",
        hint: t("INSERT_TEXT_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "insert_text" } },
      },
    },
    {
      name: "insert_index",
      type: "integer",
      required: false,
      default: 1,
      display_name: t("INSERT_INDEX_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("INSERT_INDEX_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "insert_text" } },
      },
    },
    {
      name: "replace_contains_text",
      type: "string",
      required: false,
      display_name: t("REPLACE_CONTAINS_TEXT_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("REPLACE_CONTAINS_TEXT_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "replace_all_text" } },
      },
    },
    {
      name: "replace_text",
      type: "string",
      required: false,
      display_name: t("REPLACE_TEXT_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        width: "full",
        hint: t("REPLACE_TEXT_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "replace_all_text" } },
      },
    },
    {
      name: "style_start_index",
      type: "integer",
      required: false,
      display_name: t("STYLE_START_INDEX_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("STYLE_START_INDEX_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "update_text_style" } },
      },
    },
    {
      name: "style_end_index",
      type: "integer",
      required: false,
      display_name: t("STYLE_END_INDEX_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("STYLE_END_INDEX_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "update_text_style" } },
      },
    },
    {
      name: "style_bold",
      type: "boolean",
      required: false,
      default: true,
      display_name: t("STYLE_BOLD_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("STYLE_BOLD_HINT"),
        support_expression: true,
      },
      display: {
        show: { operation: { $eq: "update_text_style" } },
      },
    },
    {
      name: "write_control_json",
      type: "string",
      required: false,
      display_name: t("WRITE_CONTROL_JSON_DISPLAY_NAME"),
      ui: {
        component: "textarea",
        width: "full",
        hint: t("WRITE_CONTROL_JSON_HINT"),
        placeholder: t("WRITE_CONTROL_JSON_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const docsClient = requireDocsClient(args.credentials, args.parameters.google_credential)
    const operation = (args.parameters.operation as string | undefined) ?? "raw_json"
    const rawRequests = args.parameters.requests_json as string | undefined
    const rawWriteControl = args.parameters.write_control_json as
      | string
      | undefined

    let requests: unknown
    if (operation === "insert_text") {
      const text = (args.parameters.insert_text as string | undefined)?.trim()
      const index = (args.parameters.insert_index as number | undefined) ?? 1
      if (!text) throw new Error("insert_text 不能为空")
      requests = [{ insertText: { location: { index }, text } }]
    } else if (operation === "replace_all_text") {
      const containsText = (
        args.parameters.replace_contains_text as string | undefined
      )?.trim()
      const replaceText = (args.parameters.replace_text as string | undefined) ?? ""
      if (!containsText) throw new Error("replace_contains_text 不能为空")
      requests = [
        {
          replaceAllText: {
            containsText: { text: containsText, matchCase: true },
            replaceText,
          },
        },
      ]
    } else if (operation === "update_text_style") {
      const startIndex = args.parameters.style_start_index as number | undefined
      const endIndex = args.parameters.style_end_index as number | undefined
      const bold = (args.parameters.style_bold as boolean | undefined) ?? true
      if (typeof startIndex !== "number" || typeof endIndex !== "number") {
        throw new Error("style_start_index 与 style_end_index 必填")
      }
      if (startIndex >= endIndex) {
        throw new Error("style_start_index 必须小于 style_end_index")
      }
      requests = [
        {
          updateTextStyle: {
            range: { startIndex, endIndex },
            textStyle: { bold },
            fields: "bold",
          },
        },
      ]
    } else {
      if (!rawRequests?.trim()) {
        throw new Error("raw_json 模式下 requests_json 不能为空")
      }
      try {
        requests = JSON.parse(rawRequests)
      } catch (error) {
        throw new Error(`requests_json 不是有效 JSON: ${(error as Error).message}`)
      }
      if (!Array.isArray(requests)) {
        throw new Error("requests_json 必须是数组，且元素为 Docs Request 对象")
      }
    }

    let writeControl: unknown
    if (rawWriteControl?.trim()) {
      try {
        writeControl = JSON.parse(rawWriteControl)
      } catch (error) {
        throw new Error(
          `write_control_json 不是有效 JSON: ${(error as Error).message}`,
        )
      }
    }

    const requestBody: {
      requests: Record<string, unknown>[]
      writeControl?: Record<string, unknown>
    } = {
      requests: requests as Record<string, unknown>[],
    }
    if (writeControl !== undefined) {
      requestBody.writeControl = writeControl as Record<string, unknown>
    }

    const response = await docsClient.documents.batchUpdate({
      documentId: args.parameters.document_id as string,
      requestBody,
    })

    return JSON.parse(
      JSON.stringify(response.data ?? {}),
    ) as JsonValue
  },
}
