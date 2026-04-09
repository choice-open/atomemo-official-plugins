import { createFeishuSdkTool } from "../feishu-base"
import userListSkill from "./user-list-skill.md" with { type: "text" }

export const userListTool = createFeishuSdkTool({
  name: "feishu_contact_user_list",
  skill: userListSkill,
  displayNameEn: "Feishu Contact User List",
  displayNameZh: "飞书批量获取员工列表",
  descriptionEn: "List users by contact.user.list",
  descriptionZh: "使用 contact.user.list 获取员工列表",
  uiFields: [
    {
      name: "department_id",
      displayNameEn: "Department ID",
      displayNameZh: "部门 ID",
      target: "params",
      key: "department_id",
      placeholder: "0",
    },
    {
      name: "department_id_type",
      displayNameEn: "Department ID Type",
      displayNameZh: "部门 ID 类型",
      target: "params",
      key: "department_id_type",
      placeholder: "open_department_id / department_id",
    },
  ],
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.contact.user.list(payload),
})
