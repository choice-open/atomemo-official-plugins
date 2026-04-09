import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import getSkill from "./get-skill.md" with { type: "text" }

export const calendarGetTool = createFeishuSdkTool({
  name: "feishu_calendar_get",
  skill: getSkill,
  displayNameEn: "Feishu Calendar Get",
  displayNameZh: "飞书查询日历信息",
  descriptionEn: "Get calendar by calendar.calendar.get",
  descriptionZh: "使用 calendar.calendar.get 查询日历信息",
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
  invokeSdk: (client, payload) => client.calendar.calendar.get(payload),
})
