import { createFeishuSdkTool, expectNestedArray } from "../feishu-base"
import userBatchGetSkill from "./user-batch-get-skill.md" with { type: "text" }

export const userBatchGetTool = createFeishuSdkTool({
  name: "feishu_contact_user_batch_get",
  skill: userBatchGetSkill,
  displayNameEn: "Feishu Contact User Batch Get",
  displayNameZh: "飞书批量获取员工信息",
  descriptionEn: "Batch get users by contact.user.batch",
  descriptionZh: "使用 contact.user.batch 批量获取员工信息",
  uiFields: [
    {
      name: "user_id_type",
      displayNameEn: "User ID Type",
      displayNameZh: "用户 ID 类型",
      target: "params",
      key: "user_id_type",
      placeholder: "open_id / user_id / union_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "user_ids")
  },
  invokeSdk: (client, payload) => client.contact.user.batch(payload),
})
