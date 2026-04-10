import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import eventDeleteSkill from "./event-delete-skill.md" with { type: "text" }

export const eventDeleteTool = createFeishuSdkTool({
  name: "feishu_calendar_event_delete",
  skill: eventDeleteSkill,
  displayNameEn: "Feishu Calendar Event Delete",
  displayNameZh: "飞书删除日程",
  descriptionEn: "Delete event by calendar.event.delete",
  descriptionZh: "使用 calendar.event.delete 删除日程",
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
      name: "event_id",
      displayNameEn: "Event ID",
      displayNameZh: "日程 ID",
      target: "path",
      key: "event_id",
      required: true,
      placeholder: "evt_xxx",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "path", "event_id")
  },
  invokeSdk: (client, payload) =>
    client.calendar.calendarEvent.delete(
      payload as unknown as Parameters<
        typeof client.calendar.calendarEvent.delete
      >[0],
    ),
})
