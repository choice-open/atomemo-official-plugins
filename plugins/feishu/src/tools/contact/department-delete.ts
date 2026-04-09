import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import departmentDeleteSkill from "./department-delete-skill.md" with {
  type: "text",
}

export const departmentDeleteTool = createFeishuSdkTool({
  name: "feishu_contact_department_delete",
  skill: departmentDeleteSkill,
  displayNameEn: "Feishu Contact Department Delete",
  displayNameZh: "飞书删除部门",
  descriptionEn: "Delete department by contact.department.delete",
  descriptionZh: "使用 contact.department.delete 删除部门",
  uiFields: [
    {
      name: "department_id",
      displayNameEn: "Department ID",
      displayNameZh: "部门 ID",
      target: "path",
      key: "department_id",
      required: true,
      placeholder: "od-xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "department_id")
  },
  invokeSdk: (client, payload) => client.contact.department.delete(payload),
})
