import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import sharedDeleteSkill from "./shared-delete-skill.md" with { type: "text" }

export const calendarSharedDeleteTool = createFeishuSdkTool({
  name: "feishu_calendar_shared_delete",
  skill: sharedDeleteSkill,
  displayNameEn: "Feishu Calendar Shared Delete",
  displayNameZh: "飞书删除共享日历",
  descriptionEn: "Delete shared calendar by calendar.calendar.delete",
  descriptionZh: "使用 calendar.calendar.delete 删除共享日历",
  uiFields: [
    {
      name: "calendar_id",
      displayNameEn: "Calendar ID",
      displayNameZh: "日历 ID",
      target: "path",
      key: "calendar_id",
      required: true,
      placeholder: "cal_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
  },
  invokeSdk: (client, payload) => client.calendar.calendar.delete(payload),
})
