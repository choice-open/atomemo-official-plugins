import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import eventListSkill from "./event-list-skill.md" with { type: "text" }

export const eventListTool = createFeishuSdkTool({
  name: "feishu_calendar_event_list",
  skill: eventListSkill,
  displayNameEn: "Feishu Calendar Event List",
  displayNameZh: "飞书获取日程列表",
  descriptionEn: "List events by calendar.event.list",
  descriptionZh: "使用 calendar.event.list 获取日程列表",
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
  invokeSdk: (client, payload) => client.calendar.event.list(payload),
})
