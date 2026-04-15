import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseImEmptyQuery } from "./im.zod"
import im_batch_messagesSkill from "./im-batch-messages-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_batch_messages",
  module: "im",
  name: "批量发送消息",
  method: "POST",
  path: "/open-apis/message/v4/batch_send/",
}

export const feishuImBatchMessagesTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Batch send messages",
    zh_Hans: "批量发送消息",
  },
  description: {
    en_US:
      "This API is used to send messages to multiple users or members in multiple departments.",
    zh_Hans: "本接口用于给多个用户或者多个部门中的成员发送消息。",
  },
  skill: im_batch_messagesSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: t("BODY_HINT"),
        placeholder: { en_US: '{"key":"value"}', zh_Hans: '{"key":"value"}' },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseImEmptyQuery({})
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    })
  },
}
