// API docs: https://developers.hubspot.com/docs/api/crm/associations
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

export const removeAssociationsTool = {
  name: "hubspot-remove-associations",
  display_name: t("REMOVE_ASSOCIATIONS_DISPLAY_NAME"),
  description: t("REMOVE_ASSOCIATIONS_DESCRIPTION"),
  icon: "🔗",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "from_object_type",
      type: "string",
      required: true,
      display_name: t("PARAM_FROM_OBJECT_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_FROM_OBJECT_TYPE_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FROM_OBJECT_TYPE_HINT"),
        support_expression: true,
      },
    },
    {
      name: "to_object_type",
      type: "string",
      required: true,
      display_name: t("PARAM_TO_OBJECT_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_TO_OBJECT_TYPE_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_TO_OBJECT_TYPE_HINT"),
        support_expression: true,
      },
    },
    {
      name: "inputs",
      type: "array",
      required: true,
      display_name: t("PARAM_ASSOCIATION_INPUTS_LABEL"),
      ai: { llm_description: t("PARAM_ASSOCIATION_INPUTS_HINT") },
      ui: { component: "array-section" },
      items: {
        type: "object",
        name: "association_pair",
        properties: [
          {
            name: "from_id",
            type: "string",
            required: true,
            display_name: t("PARAM_FROM_ID_LABEL"),
            ui: { component: "input", support_expression: true },
          },
          {
            name: "to_id",
            type: "string",
            required: true,
            display_name: t("PARAM_TO_ID_LABEL"),
            ui: { component: "input", support_expression: true },
          },
        ],
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const fromType = getString(args.parameters, "from_object_type")
    const toType = getString(args.parameters, "to_object_type")
    if (!fromType || !toType)
      throw new Error("from_object_type and to_object_type are required")

    const inputs = args.parameters.inputs as
      | Array<{ from_id: string; to_id: string }>
      | undefined
    if (!inputs?.length)
      throw new Error("At least one association pair is required")

    try {
      const result = await client.crm.associations.v4.batchApi.archive(
        fromType,
        toType,
        {
          inputs: inputs.map((i) => ({
            _from: { id: i.from_id },
            to: [{ id: i.to_id }],
          })),
        },
      )
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
