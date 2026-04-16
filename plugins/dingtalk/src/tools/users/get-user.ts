import { z } from "zod"
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"
import getUserSkill from "../../skills/tools/get-user.md" with { type: "text" }

const paramsSchema = z.object({
  credential_id: z.string(),
  user_id: nonEmptyString,
})

export const getUserTool: ToolDefinition = {
  name: "dingtalk-user-get",
  display_name: t("USER_GET_TOOL_DISPLAY_NAME"),
  description: t("USER_GET_TOOL_DESCRIPTION"),
  icon: "👤",
  skill: getUserSkill,
  parameters: [
    credentialParameter,
    {
      name: "user_id",
      type: "string",
      required: true,
      display_name: t("PARAM_USER_ID_LABEL"),
      ai: {
        llm_description: t("USER_GET_USER_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        placeholder: t("PARAM_USER_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)

    return dingtalkRequest(credential, {
      method: "POST",
      // api doc url: https://open.dingtalk.com/document/development/query-user-details
      // 需要权限：成员信息读权限
      // 权限点code:  qyapi_get_member
      url: "https://oapi.dingtalk.com/topapi/v2/user/get",
      body: { userid: params.user_id },
    })
  },
}
