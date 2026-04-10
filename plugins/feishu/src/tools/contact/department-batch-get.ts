import { createFeishuSdkTool, expectNestedArray } from "../feishu-base"
import departmentBatchGetSkill from "./department-batch-get-skill.md" with {
  type: "text",
}

export const departmentBatchGetTool = createFeishuSdkTool({
  name: "feishu_contact_department_batch_get",
  skill: departmentBatchGetSkill,
  displayNameEn: "Feishu Contact Department Batch Get",
  displayNameZh: "飞书批量获取部门信息",
  descriptionEn: "Batch get departments by contact.department.batch",
  descriptionZh: "使用 contact.department.batch 批量获取部门信息",
  uiFields: [
    {
      name: "department_id_type",
      displayNameEn: "Department ID Type",
      displayNameZh: "部门 ID 类型",
      target: "params",
      key: "department_id_type",
      placeholder: "department_id / open_department_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "department_ids")
  },
  invokeSdk: (client, payload) =>
    client.contact.department.batch(
      payload as { params: { department_ids: string[] } },
    ),
})
