import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import messageBatchSendSkill from "./message-batch-send-skill.md" with {
  type: "text",
}

export const messageBatchSendTool = createFeishuSdkTool({
  name: "feishu_im_message_batch_send",
  skill: messageBatchSendSkill,
  displayNameEn: "Feishu IM Message Batch Send",
  displayNameZh: "飞书批量发送消息",
  descriptionEn: "Batch send message by im.message.forward",
  descriptionZh: "使用 im.message.forward 批量发送消息",
  uiFields: [
    {
      name: "message_id",
      displayNameEn: "Message ID",
      displayNameZh: "消息 ID",
      target: "path",
      key: "message_id",
      required: true,
      placeholder: "om_xxx",
    },
    {
      name: "to_ids_json",
      displayNameEn: "Target IDs(JSON Array)",
      displayNameZh: "目标接收者 ID 数组(JSON)",
      target: "data",
      key: "to_ids",
      valueType: "json",
      placeholder: '["ou_xxx","ou_yyy"]',
    },
    {
      name: "receive_id_type",
      displayNameEn: "Receive ID Type",
      displayNameZh: "接收者 ID 类型",
      target: "params",
      key: "receive_id_type",
      placeholder: "open_id / user_id / union_id / chat_id / email",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "message_id")
  },
  invokeSdk: (client, payload) => client.im.message.forward(payload),
})
