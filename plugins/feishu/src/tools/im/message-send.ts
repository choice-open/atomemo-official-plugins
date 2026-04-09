import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import messageSendSkill from "./message-send-skill.md" with { type: "text" }

export const messageSendTool = createFeishuSdkTool({
  name: "feishu_im_message_send",
  skill: messageSendSkill,
  displayNameEn: "Feishu IM Message Send",
  displayNameZh: "飞书发送消息",
  descriptionEn: "Send message by im.message.create",
  descriptionZh: "使用 im.message.create 发送消息",
  uiFields: [
    {
      name: "receive_id_type",
      displayNameEn: "Receive ID Type",
      displayNameZh: "接收者 ID 类型",
      target: "params",
      key: "receive_id_type",
      required: true,
      placeholder: "open_id / user_id / union_id / chat_id / email",
    },
    {
      name: "receive_id",
      displayNameEn: "Receive ID",
      displayNameZh: "接收者 ID",
      target: "data",
      key: "receive_id",
      required: true,
      placeholder: "ou_xxx",
    },
    {
      name: "msg_type",
      displayNameEn: "Message Type",
      displayNameZh: "消息类型",
      target: "data",
      key: "msg_type",
      required: true,
      placeholder: "text",
    },
    {
      name: "content",
      displayNameEn: "Message Content(JSON String)",
      displayNameZh: "消息内容(JSON 字符串)",
      target: "data",
      key: "content",
      required: true,
      placeholder: '{"text":"hello"}',
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "params", "receive_id_type")
    expectNestedString(payload, "data", "receive_id")
    expectNestedString(payload, "data", "msg_type")
    expectNestedString(payload, "data", "content")
  },
  invokeSdk: (client, payload) => client.im.message.create(payload),
})
