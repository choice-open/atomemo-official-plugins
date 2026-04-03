import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { requireDocsClient } from "../../lib/docs-client"
import getDocumentSkill from "./get-document-skill.md" with { type: "text" }

export const getDocumentTool: ToolDefinition = {
  name: "get-document",
  display_name: t("GET_DOCUMENT_TOOL_DISPLAY_NAME"),
  description: t("GET_DOCUMENT_TOOL_DESCRIPTION"),
  skill: getDocumentSkill,
  icon: "📖",
  parameters: [
    {
      name: "google_credential",
      type: "credential_id",
      required: true,
      display_name: t("GOOGLE_DOCS_CREDENTIAL_PARAM_DISPLAY_NAME"),
      credential_name: "google-docs-oauth2",
    },
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
      name: "include_tabs_content",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("INCLUDE_TABS_CONTENT_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("INCLUDE_TABS_CONTENT_HINT"),
        support_expression: true,
      },
    },
    {
      name: "suggestions_view_mode",
      type: "string",
      required: false,
      display_name: t("SUGGESTIONS_VIEW_MODE_DISPLAY_NAME"),
      enum: [
        "DEFAULT_FOR_CURRENT_ACCESS",
        "SUGGESTIONS_INLINE",
        "PREVIEW_SUGGESTIONS_ACCEPTED",
        "PREVIEW_WITHOUT_SUGGESTIONS",
      ],
      ui: {
        component: "select",
        hint: t("SUGGESTIONS_VIEW_MODE_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const docsClient = requireDocsClient(args.credentials, args.parameters.google_credential)

    const suggestionsViewMode = args.parameters.suggestions_view_mode as
      | string
      | undefined

    const response = await docsClient.documents.get({
      documentId: args.parameters.document_id as string,
      includeTabsContent:
        (args.parameters.include_tabs_content as boolean | undefined) ?? false,
      ...(suggestionsViewMode
        ? { suggestionsViewMode }
        : {}),
    })

    return JSON.parse(
      JSON.stringify(response.data ?? {}),
    ) as JsonValue
  },
}
