import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import eventSearchSkill from "./event-search-skill.md" with { type: "text" }

export const eventSearchTool = createFeishuSdkTool({
  name: "feishu_calendar_event_search",
  skill: eventSearchSkill,
  displayNameEn: "Feishu Calendar Event Search",
  displayNameZh: "飞书搜索日程",
  descriptionEn: "Search events by calendar.event.search",
  descriptionZh: "使用 calendar.event.search 搜索日程",
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
      name: "query",
      displayNameEn: "Query",
      displayNameZh: "搜索关键词",
      target: "data",
      key: "query",
      required: true,
      placeholder: "例会",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "path", "calendar_id")
    expectNestedString(payload, "data", "query")
  },
  invokeSdk: (client, payload) =>
    client.calendar.calendarEvent.search(
      payload as unknown as Parameters<
        typeof client.calendar.calendarEvent.search
      >[0],
    ),
})
