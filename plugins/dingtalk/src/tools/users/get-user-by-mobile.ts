import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  mobile: nonEmptyString,
})

export const getUserByMobileTool: ToolDefinition = {
  name: "dingtalk-user-get-by-mobile",
  display_name: t("USER_GET_BY_MOBILE_TOOL_DISPLAY_NAME"),
  description: t("USER_GET_BY_MOBILE_TOOL_DESCRIPTION"),
  icon: "📱",
  parameters: [
    credentialParameter,
    {
      name: "mobile",
      type: "string",
      required: true,
      display_name: t("PARAM_MOBILE_LABEL"),
      ai: {
        llm_description: t("USER_GET_BY_MOBILE_MOBILE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        placeholder: t("PARAM_MOBILE_PLACEHOLDER"),
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
      url: "https://oapi.dingtalk.com/topapi/v2/user/getbymobile",
      body: { mobile: params.mobile },
    })
  },
}
