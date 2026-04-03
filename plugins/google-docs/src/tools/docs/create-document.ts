import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { GoogleDocsCredentialParameter, requireDocsClient } from "../../lib/docs-client"
import createDocumentSkill from "./create-document-skill.md" with { type: "text" }

export const createDocumentTool: ToolDefinition = {
  name: "create-document",
  display_name: t("CREATE_DOCUMENT_TOOL_DISPLAY_NAME"),
  description: t("CREATE_DOCUMENT_TOOL_DESCRIPTION"),
  skill: createDocumentSkill,
  icon: "📝",
  parameters: [
    GoogleDocsCredentialParameter,
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
    const docsClient = requireDocsClient(args.credentials, args.parameters.google_credential)

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
