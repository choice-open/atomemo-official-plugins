import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import userCreateSkill from "./user-create-skill.md" with { type: "text" }

export const userCreateTool = createFeishuSdkTool({
  name: "feishu_contact_user_create",
  skill: userCreateSkill,
  displayNameEn: "Feishu Contact User Create",
  displayNameZh: "飞书创建员工",
  descriptionEn: "Create employee by contact.user.create",
  descriptionZh: "使用 contact.user.create 创建员工",
  uiFields: [
    {
      name: "name",
      displayNameEn: "Name",
      displayNameZh: "姓名",
      target: "data",
      key: "name",
      required: true,
      placeholder: "张三",
    },
    {
      name: "mobile",
      displayNameEn: "Mobile",
      displayNameZh: "手机号",
      target: "data",
      key: "mobile",
      placeholder: "13800000000",
    },
    {
      name: "email",
      displayNameEn: "Email",
      displayNameZh: "邮箱",
      target: "data",
      key: "email",
      placeholder: "user@example.com",
    },
    {
      name: "department_ids",
      displayNameEn: "Department IDs (JSON Array)",
      displayNameZh: "部门 ID 数组(JSON)",
      target: "data",
      key: "department_ids",
      valueType: "json",
      placeholder: '["od-xxx"]',
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "name")
  },
  invokeSdk: (client, payload) =>
    client.contact.user.create(
      payload as unknown as Parameters<typeof client.contact.user.create>[0],
    ),
})
