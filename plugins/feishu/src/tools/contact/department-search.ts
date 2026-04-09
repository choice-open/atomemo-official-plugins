import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import departmentSearchSkill from "./department-search-skill.md" with {
  type: "text",
}

export const departmentSearchTool = createFeishuSdkTool({
  name: "feishu_contact_department_search",
  skill: departmentSearchSkill,
  displayNameEn: "Feishu Contact Department Search",
  displayNameZh: "飞书搜索部门",
  descriptionEn: "Search departments by contact.department.search",
  descriptionZh: "使用 contact.department.search 搜索部门",
  uiFields: [
    {
      name: "department_name",
      displayNameEn: "Department Name",
      displayNameZh: "部门名称",
      target: "data",
      key: "query",
      placeholder: "研发",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "query")
  },
  invokeSdk: (client, payload) => client.contact.department.search(payload),
})
