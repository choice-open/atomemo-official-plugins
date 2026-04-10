import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import departmentCreateSkill from "./department-create-skill.md" with {
  type: "text",
}

export const departmentCreateTool = createFeishuSdkTool({
  name: "feishu_contact_department_create",
  skill: departmentCreateSkill,
  displayNameEn: "Feishu Contact Department Create",
  displayNameZh: "飞书创建部门",
  descriptionEn: "Create department by contact.department.create",
  descriptionZh: "使用 contact.department.create 创建部门",
  uiFields: [
    {
      name: "department_name",
      displayNameEn: "Department Name",
      displayNameZh: "部门名称",
      target: "data",
      key: "name",
      required: true,
      placeholder: "研发部",
    },
    {
      name: "parent_department_id",
      displayNameEn: "Parent Department ID",
      displayNameZh: "父部门 ID",
      target: "data",
      key: "parent_department_id",
      placeholder: "0",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "name")
  },
  invokeSdk: (client, payload) =>
    client.contact.department.create(
      payload as unknown as Parameters<
        typeof client.contact.department.create
      >[0],
    ),
})
