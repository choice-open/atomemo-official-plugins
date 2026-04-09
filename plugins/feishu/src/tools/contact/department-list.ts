import { createFeishuSdkTool } from "../feishu-base"
import departmentListSkill from "./department-list-skill.md" with {
  type: "text",
}

export const departmentListTool = createFeishuSdkTool({
  name: "feishu_contact_department_list",
  skill: departmentListSkill,
  displayNameEn: "Feishu Contact Department List",
  displayNameZh: "飞书获取部门列表",
  descriptionEn: "List departments by contact.department.list",
  descriptionZh: "使用 contact.department.list 获取部门列表",
  uiFields: [
    {
      name: "parent_department_id",
      displayNameEn: "Parent Department ID",
      displayNameZh: "父部门 ID",
      target: "params",
      key: "parent_department_id",
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
  invokeSdk: (client, payload) => client.contact.department.list(payload),
})
