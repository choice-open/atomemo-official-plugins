// API docs: https://developers.hubspot.com/docs/api/automation/workflows
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { credentialParams } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
} from "../../_shared/utils"

export const addContactToWorkflowTool = {
  name: "hubspot-add-contact-to-workflow",
  display_name: t("ADD_CONTACT_TO_WORKFLOW_DISPLAY_NAME"),
  description: t("ADD_CONTACT_TO_WORKFLOW_DESCRIPTION"),
  icon: "⚙️",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "workflow_id",
      type: "string",
      required: true,
      display_name: t("PARAM_WORKFLOW_ID_LABEL"),
      ai: { llm_description: t("PARAM_WORKFLOW_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_WORKFLOW_ID_HINT"),
        placeholder: t("PARAM_WORKFLOW_ID_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "contact_email",
      type: "string",
      required: true,
      display_name: t("PARAM_WORKFLOW_CONTACT_EMAIL_LABEL"),
      ai: { llm_description: t("PARAM_WORKFLOW_CONTACT_EMAIL_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_WORKFLOW_CONTACT_EMAIL_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const workflowId = getString(args.parameters, "workflow_id")
    const contactEmail = getString(args.parameters, "contact_email")
    if (!workflowId || !contactEmail)
      throw new Error("workflow_id and contact_email are required")

    try {
      const response = await client.apiRequest({
        method: "POST",
        path: `/automation/v4/flows/${workflowId}/enrollments`,
        body: { email: contactEmail },
      })
      const result = await response.json()
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
