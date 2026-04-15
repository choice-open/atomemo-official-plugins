import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, optionalTrimmedString, parseParams, stringArray } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  robot_code: nonEmptyString,
  remind_type: z.preprocess((v) => (v == null || v === "" ? 1 : Number(v)), z.number()),
  receiver_user_id_list: stringArray,
  content: nonEmptyString,
  call_voice: optionalTrimmedString,
})

export const sendDingMessageTool: ToolDefinition = {
  name: "dingtalk-robot-send-ding",
  display_name: t("ROBOT_SEND_DING_TOOL_DISPLAY_NAME"),
  description: t("ROBOT_SEND_DING_TOOL_DESCRIPTION"),
  icon: "📣",
  parameters: [
    credentialParameter,
    {
      name: "robot_code",
      type: "string",
      required: true,
      display_name: t("PARAM_ROBOT_CODE_LABEL"),
      ai: {
        llm_description: t("ROBOT_SEND_DING_ROBOT_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remind_type",
      type: "string",
      required: false,
      default: "1",
      enum: ["1", "2", "3"],
      display_name: t("PARAM_REMIND_TYPE_LABEL"),
      ai: {
        llm_description: t("ROBOT_SEND_DING_REMIND_TYPE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "select",
        options: [
          { label: t("OPTION_REMIND_TYPE_IN_APP"), value: "1" },
          { label: t("OPTION_REMIND_TYPE_SMS"), value: "2" },
          { label: t("OPTION_REMIND_TYPE_PHONE"), value: "3" },
        ],
        support_expression: true,
      },
    },
    {
      name: "receiver_user_id_list",
      type: "array",
      required: true,
      display_name: t("PARAM_RECEIVER_USER_ID_LIST_LABEL"),
      items: {
        name: "receiver_user_id_list_item",
        type: "string",
      },
      ui: {
        component: "tag-input",
      },
    },
    {
      name: "content",
      type: "string",
      required: true,
      display_name: t("PARAM_CONTENT_LABEL"),
      ai: {
        llm_description: t("ROBOT_SEND_DING_CONTENT_LLM_DESCRIPTION"),
      },
      ui: {
        component: "textarea",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "call_voice",
      type: "string",
      required: false,
      default: "Standard_Female_Voice",
      enum: [
        "Standard_Female_Voice",
        "Cantonese_Female_Voice",
        "Gentine_Female_Voice",
        "Overbearing_Female_Voice",
        "Lovely_Girl_Voice",
        "Standard_Male_Voice",
      ],
      display_name: t("PARAM_CALL_VOICE_LABEL"),
      ai: {
        llm_description: t("ROBOT_SEND_DING_CALL_VOICE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "select",
        support_expression: true,
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/robot/ding/send",
      body: {
        robotCode: params.robot_code,
        remindType: params.remind_type,
        receiverUserIdList: params.receiver_user_id_list,
        content: params.content,
        ...(params.remind_type === 3 && params.call_voice
          ? { callVoice: params.call_voice }
          : {}),
      },
    })
  },
}
