import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import updateSkill from "./update-skill.md" with { type: "text" }

export const calendarUpdateTool = createFeishuSdkTool({
  name: "feishu_calendar_update",
  skill: updateSkill,
  displayNameEn: "Feishu Calendar Update",
  displayNameZh: "飞书更新日历信息",
  descriptionEn: "Update calendar by calendar.calendar.patch",
  descriptionZh: "使用 calendar.calendar.patch 更新日历信息",
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
  invokeSdk: (client, payload) =>
    client.calendar.calendar.patch(
      payload as { path: { calendar_id: string } },
    ),
})
