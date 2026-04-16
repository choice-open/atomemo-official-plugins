import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import {
  coercedNumber,
  nonEmptyString,
  optionalDateTimeRangeEndMs,
  optionalStringArray,
  parseParams,
  requiredDateTimeRangeStartMs,
} from "../../lib/schemas"
import listProcessInstanceIdsSkill from "../../skills/tools/list-process-instance-ids.md" with {
  type: "text",
}

const paramsSchema = z.object({
  credential_id: z.string(),
  process_code: nonEmptyString,
  start_time: requiredDateTimeRangeStartMs,
  end_time: optionalDateTimeRangeEndMs,
  user_ids: optionalStringArray,
  statuses: optionalStringArray,
  max_results: coercedNumber.default(20),
  next_token: coercedNumber.default(0),
})

export const listProcessInstanceIdsTool: ToolDefinition = {
  name: "dingtalk-workflow-list-process-instance-ids",
  display_name: t("WORKFLOW_LIST_INSTANCE_IDS_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_LIST_INSTANCE_IDS_TOOL_DESCRIPTION"),
  icon: "🧾",
  skill: listProcessInstanceIdsSkill,
  parameters: [
    credentialParameter,
    {
      name: "process_code",
      type: "string",
      required: true,
      display_name: t("PARAM_PROCESS_CODE_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_INSTANCE_IDS_PROCESS_CODE_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "start_time",
      type: "string",
      required: true,
      display_name: t("PARAM_START_TIME_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_INSTANCE_IDS_START_TIME_LLM_DESCRIPTION",
        ),
      },
      ui: {
        hint: t("PARAM_START_TIME_HINT"),
        component: "input",
        placeholder: t("PARAM_START_TIME_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: false,
      display_name: t("PARAM_END_TIME_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_INSTANCE_IDS_END_TIME_LLM_DESCRIPTION",
        ),
      },
      ui: {
        hint: t("PARAM_END_TIME_HINT"),
        component: "input",
        placeholder: t("PARAM_END_TIME_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "user_ids",
      type: "array",
      required: false,
      display_name: t("PARAM_STARTER_USER_IDS_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_INSTANCE_IDS_USER_IDS_LLM_DESCRIPTION",
        ),
      },
      items: {
        name: "user_ids_item",
        type: "string",
      },
      ui: {
        component: "tag-input",
      },
    },
    {
      name: "statuses",
      type: "array",
      required: false,
      display_name: t("PARAM_STATUSES_LABEL"),
      items: {
        name: "statuses_item",
        type: "string",
        enum: ["RUNNING", "TERMINATED", "COMPLETED", "COMPLETED_WITH_BLANKS"],
      },
      ui: {
        component: "multi-select",
        options: [
          { value: "RUNNING", label: t("OPTION_STATUS_RUNNING") },
          { value: "TERMINATED", label: t("OPTION_STATUS_TERMINATED") },
          { value: "COMPLETED", label: t("OPTION_STATUS_COMPLETED") },
          {
            value: "COMPLETED_WITH_BLANKS",
            label: t("OPTION_STATUS_COMPLETED_WITH_BLANKS"),
          },
        ],
      },
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      default: 20,
      minimum: 1,
      maximum: 100,
      display_name: t("PARAM_MAX_RESULTS_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_INSTANCE_IDS_MAX_RESULTS_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
    {
      name: "next_token",
      type: "integer",
      required: false,
      default: 0,
      minimum: 0,
      display_name: t("PARAM_NEXT_TOKEN_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_INSTANCE_IDS_NEXT_TOKEN_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    if (params.end_time !== undefined && params.end_time < params.start_time) {
      throw new Error("end_time must be greater than or equal to start_time.")
    }

    const credential = resolveCredential(args)

    // api doc url: https://open.dingtalk.com/document/development/obtain-an-approval-list-of-instance-ids
    return dingtalkRequest(credential, {
      method: "POST",
      path: "/workflow/processes/instanceIds/query",
      body: {
        processCode: params.process_code,
        startTime: params.start_time,
        ...(params.end_time !== undefined ? { endTime: params.end_time } : {}),
        ...(params.user_ids ? { userIds: params.user_ids } : {}),
        ...(params.statuses ? { statuses: params.statuses } : {}),
        maxResults: params.max_results,
        nextToken: params.next_token,
      },
    })
  },
}
