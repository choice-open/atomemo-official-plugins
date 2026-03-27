import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { requireDocsClient } from "../../lib/docs-client"
import createDocumentSkill from "./create-document-skill.md" with { type: "text" }

export const createDocumentTool: ToolDefinition = {
  name: "create-document",
  display_name: t("CREATE_DOCUMENT_TOOL_DISPLAY_NAME"),
  description: t("CREATE_DOCUMENT_TOOL_DESCRIPTION"),
  skill: createDocumentSkill,
  icon: "📝",
  parameters: [
    {
      name: "google_credential",
      type: "credential_id",
      required: true,
      display_name: t("GOOGLE_DOCS_CREDENTIAL_PARAM_DISPLAY_NAME"),
      credential_name: "google-docs-oauth2",
    },
    {
      name: "title",
      type: "string",
      required: true,
      display_name: t("DOCUMENT_TITLE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("DOCUMENT_TITLE_PLACEHOLDER"),
        hint: t("DOCUMENT_TITLE_HINT"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const docsClient = requireDocsClient(args.credentials, "google_credential")

    const response = await docsClient.documents.create({
      requestBody: {
        title: args.parameters.title as string,
      },
    })

    return JSON.parse(
      JSON.stringify(response.data ?? {}),
    ) as JsonValue
  },
}
