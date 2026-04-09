import {
  createFeishuSdkTool,
  expectAtLeastOneNestedField,
} from "../feishu-base"
import userSearchSkill from "./user-search-skill.md" with { type: "text" }

export const userSearchTool = createFeishuSdkTool({
  name: "feishu_contact_user_search",
  skill: userSearchSkill,
  displayNameEn: "Feishu Contact User Search",
  displayNameZh: "飞书搜索员工信息",
  descriptionEn: "Search users by contact.user.batchGetId",
  descriptionZh: "使用 contact.user.batchGetId 搜索员工信息",
  uiFields: [
    {
      name: "emails_json",
      displayNameEn: "Emails(JSON Array)",
      displayNameZh: "邮箱数组(JSON)",
      target: "data",
      key: "emails",
      valueType: "json",
      placeholder: '["user@example.com","user2@example.com"]',
    },
    {
      name: "mobiles_json",
      displayNameEn: "Mobiles(JSON Array)",
      displayNameZh: "手机号数组(JSON)",
      target: "data",
      key: "mobiles",
      valueType: "json",
      placeholder: '["13800000000"]',
    },
  ],
  validatePayload: (payload) => {
    expectAtLeastOneNestedField(payload, "data", ["emails", "mobiles"])
  },
  invokeSdk: (client, payload) => client.contact.user.batchGetId(payload),
})
