import { z } from "zod"
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { coercedNumber, nonEmptyString, parseParams } from "../../lib/schemas"
import searchUsersSkill from "../../skills/tools/search-users.md" with {
  type: "text",
}

const paramsSchema = z.object({
  credential_id: z.string(),
  query_word: nonEmptyString,
  offset: coercedNumber.default(0),
  size: coercedNumber.default(10),
  full_match_field: z
    .preprocess((v) => (v == null ? false : v), z.boolean())
    .optional(),
})

export const searchUsersTool: ToolDefinition = {
  name: "dingtalk-user-search",
  display_name: t("USER_SEARCH_TOOL_DISPLAY_NAME"),
  description: t("USER_SEARCH_TOOL_DESCRIPTION"),
  icon: "🔎",
  skill: searchUsersSkill,
  parameters: [
    credentialParameter,
    {
      name: "query_word",
      type: "string",
      required: true,
      display_name: t("PARAM_QUERY_WORD_LABEL"),
      ai: {
        llm_description: t("USER_SEARCH_QUERY_WORD_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        hint: t("PARAM_QUERY_WORD_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "offset",
      type: "integer",
      required: false,
      default: 0,
      minimum: 0,
      display_name: t("PARAM_OFFSET_LABEL"),
      ai: {
        llm_description: t("USER_SEARCH_OFFSET_LLM_DESCRIPTION"),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
    {
      name: "size",
      type: "integer",
      required: false,
      default: 10,
      minimum: 1,
      maximum: 100,
      display_name: t("PARAM_SIZE_LABEL"),
      ai: {
        llm_description: t("USER_SEARCH_SIZE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
    {
      name: "full_match_field",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("PARAM_FULL_MATCH_FIELD_LABEL"),
      ai: {
        llm_description: t("USER_SEARCH_FULL_MATCH_FIELD_LLM_DESCRIPTION"),
      },
      ui: {
        component: "switch",
        support_expression: true,
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)

    return dingtalkRequest(credential, {
      method: "POST",
      // api doc url: https://open.dingtalk.com/document/development/address-book-search-user-id
      // 需要权限： 搜索企业通讯录的权限
      path: "/contact/users/search",
      body: {
        offset: params.offset,
        size: params.size,
        queryWord: params.query_word,
        ...(params.full_match_field ? { fullMatchField: 1 } : {}),
      },
    })
  },
}
