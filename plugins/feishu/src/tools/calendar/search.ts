import { createFeishuSdkTool, expectNestedString } from "../feishu-base"
import searchSkill from "./search-skill.md" with { type: "text" }

export const calendarSearchTool = createFeishuSdkTool({
  name: "feishu_calendar_search",
  skill: searchSkill,
  displayNameEn: "Feishu Calendar Search",
  displayNameZh: "飞书搜索日历",
  descriptionEn: "Search calendars by calendar.calendar.search",
  descriptionZh: "使用 calendar.calendar.search 搜索日历",
  uiFields: [
    {
      name: "query",
      displayNameEn: "Query",
      displayNameZh: "搜索关键词",
      target: "data",
      key: "query",
      required: true,
      placeholder: "团队",
    },
  ],
  validatePayload: (payload) => {
    expectNestedString(payload, "data", "query")
  },
  invokeSdk: (client, payload) =>
    client.calendar.calendar.search(payload as { data: { query: string } }),
})
