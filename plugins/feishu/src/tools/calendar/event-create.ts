import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import eventCreateSkill from "./event-create-skill.md" with { type: "text" }

export const eventCreateTool = createFeishuSdkTool({
  name: "feishu_calendar_event_create",
  skill: eventCreateSkill,
  displayNameEn: "Feishu Calendar Event Create",
  displayNameZh: "飞书创建日程",
  descriptionEn: "Create event by calendar.event.create",
  descriptionZh: "使用 calendar.event.create 创建日程",
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
    {
      name: "summary",
      displayNameEn: "Event Summary",
      displayNameZh: "日程标题",
      target: "data",
      key: "summary",
      required: true,
      placeholder: "项目例会",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "data", "summary")
  },
  invokeSdk: (client, payload) =>
    client.calendar.calendarEvent.create(
      payload as unknown as Parameters<
        typeof client.calendar.calendarEvent.create
      >[0],
    ),
})
