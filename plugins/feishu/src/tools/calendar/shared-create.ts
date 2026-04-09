import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import sharedCreateSkill from "./shared-create-skill.md" with { type: "text" }

export const calendarSharedCreateTool = createFeishuSdkTool({
  name: "feishu_calendar_shared_create",
  skill: sharedCreateSkill,
  displayNameEn: "Feishu Calendar Shared Create",
  displayNameZh: "飞书创建共享日历",
  descriptionEn: "Create shared calendar by calendar.calendar.create",
  descriptionZh: "使用 calendar.calendar.create 创建共享日历",
  uiFields: [
    {
      name: "summary",
      displayNameEn: "Calendar Summary",
      displayNameZh: "日历标题",
      target: "data",
      key: "summary",
      required: true,
      placeholder: "团队日历",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "summary")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.create(payload),
})
