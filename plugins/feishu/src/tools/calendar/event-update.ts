import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import eventUpdateSkill from "./event-update-skill.md" with { type: "text" }

export const eventUpdateTool = createFeishuSdkTool({
  name: "feishu_calendar_event_update",
  skill: eventUpdateSkill,
  displayNameEn: "Feishu Calendar Event Update",
  displayNameZh: "飞书更新日程",
  descriptionEn: "Update event by calendar.event.patch",
  descriptionZh: "使用 calendar.event.patch 更新日程",
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
    client.calendar.calendarEvent.patch(
      payload as unknown as Parameters<
        typeof client.calendar.calendarEvent.patch
      >[0],
    ),
})
