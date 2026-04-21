// API docs: https://developers.hubspot.com/docs/api/crm/pipelines
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

export const getPipelineStageDetailsTool = {
  name: "hubspot-get-pipeline-stage-details",
  display_name: t("GET_PIPELINE_STAGE_DETAILS_DISPLAY_NAME"),
  description: t("GET_PIPELINE_STAGE_DETAILS_DESCRIPTION"),
  icon: "🔀",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "pipeline_object_type",
      type: "string",
      required: true,
      display_name: t("PARAM_PIPELINE_OBJECT_TYPE_LABEL"),
      ai: { llm_description: t("PARAM_PIPELINE_OBJECT_TYPE_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_PIPELINE_OBJECT_TYPE_HINT"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectType = getString(args.parameters, "pipeline_object_type")
    if (!objectType) throw new Error("pipeline_object_type is required")
    try {
      const result = await client.crm.pipelines.pipelinesApi.getAll(objectType)
      return {
        success: true,
        pipelines: result.results,
      } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
