import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import departmentUpdateSkill from "./department-update-skill.md" with {
  type: "text",
}

export const departmentUpdateTool = createFeishuSdkTool({
  name: "feishu_contact_department_update",
  skill: departmentUpdateSkill,
  displayNameEn: "Feishu Contact Department Update",
  displayNameZh: "飞书更新部门",
  descriptionEn: "Update department by contact.department.patch",
  descriptionZh: "使用 contact.department.patch 更新部门",
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
  invokeSdk: (client, payload) => client.contact.department.patch(payload),
})
