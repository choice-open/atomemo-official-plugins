// API docs: https://developers.hubspot.com/docs/api/marketing/forms
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
  resolveStringMap,
  toJsonValue,
} from "../../_shared/utils"

export const createFormSubmissionTool = {
  name: "hubspot-create-form-submission",
  display_name: t("CREATE_FORM_SUBMISSION_DISPLAY_NAME"),
  description: t("CREATE_FORM_SUBMISSION_DESCRIPTION"),
  icon: "📝",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "portal_id",
      type: "string",
      required: true,
      display_name: t("PARAM_PORTAL_ID_LABEL"),
      ai: { llm_description: t("PARAM_PORTAL_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_PORTAL_ID_HINT"),
        placeholder: t("PARAM_PORTAL_ID_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "form_guid",
      type: "string",
      required: true,
      display_name: t("PARAM_FORM_GUID_LABEL"),
      ai: { llm_description: t("PARAM_FORM_GUID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FORM_GUID_HINT"),
        placeholder: t("PARAM_FORM_GUID_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "fields",
      type: "array",
      required: true,
      display_name: t("PARAM_FORM_FIELDS_LABEL"),
      ai: { llm_description: t("PARAM_FORM_FIELDS_HINT") },
      ui: { component: "key-value-editor", hint: t("PARAM_FORM_FIELDS_HINT") },
      items: {
        type: "object",
        name: "field",
        properties: [
          {
            name: "key",
            type: "string",
            required: true,
            display_name: t("PARAM_FORM_FIELD_NAME_LABEL"),
          },
          {
            name: "value",
            type: "string",
            required: true,
            display_name: t("PARAM_FORM_FIELD_VALUE_LABEL"),
            ui: { component: "textarea", support_expression: true },
          },
        ],
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const portalId = getString(args.parameters, "portal_id")
    const formGuid = getString(args.parameters, "form_guid")
    if (!portalId || !formGuid)
      throw new Error("portal_id and form_guid are required")

    const fieldsObj = resolveStringMap(args.parameters.fields) ?? {}
    const fields = Object.entries(fieldsObj).map(([name, value]) => ({
      name,
      value: String(value),
    }))

    try {
      const response = await client.apiRequest({
        method: "POST",
        path: `/submissions/v3/integration/secure/submit/${portalId}/${formGuid}`,
        body: { fields },
      })
      const result = await response.json()
      return toJsonValue({ success: true, result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
