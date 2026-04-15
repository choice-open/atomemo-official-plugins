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
import { parseImSendMessageQuery } from "./im.zod"
import im_send_messageSkill from "./im-send-message-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_send_message",
  module: "im",
  name: "发送消息",
  method: "POST",
  path: "/open-apis/im/v1/messages",
}

export const feishuImSendMessageTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Send message",
    zh_Hans: "发送消息",
  },
  description: {
    en_US:
      "This API is used to send a message to a specified user or group chat.",
    zh_Hans: "本接口用于向指定用户或者群聊发送消息。",
  },
  skill: im_send_messageSkill,
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
      name: "receive_id_type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Receive ID Type",
        zh_Hans: "消息接收方 ID 类型",
      },
      ui: {
        component: "input",
        placeholder: {
          en_US: "open_id | union_id | user_id | email | chat_id",
          zh_Hans: "open_id | union_id | user_id | email | chat_id",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"receive_id_type">,
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
    const queryParams = parseImSendMessageQuery({
      receive_id_type: readRequiredStringParam(p, "receive_id_type"),
    })
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
