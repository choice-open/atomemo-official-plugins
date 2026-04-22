// API docs: https://developers.hubspot.com/docs/api/automation/workflows
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { hubspotLocatorListMethods } from "../../_shared/methods"
import {
  credentialParams,
  workflowIdParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getResourceLocatorValue,
  getString,
  handleHubSpotError,
  toJsonValue,
} from "../../_shared/utils"

export const addContactToWorkflowTool = {
  name: "hubspot-add-contact-to-workflow",
  display_name: t("ADD_CONTACT_TO_WORKFLOW_DISPLAY_NAME"),
  description: t("ADD_CONTACT_TO_WORKFLOW_DESCRIPTION"),
  icon: "⚙️",
  skill: "",
  parameters: [
    ...credentialParams,
    workflowIdParam,
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
  locator_list: hubspotLocatorListMethods,

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const workflowId = getResourceLocatorValue(args.parameters, "workflow_id")
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
      return toJsonValue({ success: true, result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
