import { createFeishuSdkTool } from "../feishu-base"
import listSkill from "./list-skill.md" with { type: "text" }

export const calendarListTool = createFeishuSdkTool({
  name: "feishu_calendar_list",
  skill: listSkill,
  displayNameEn: "Feishu Calendar List",
  displayNameZh: "飞书查询日历列表",
  descriptionEn: "List calendars by calendar.calendar.list",
  descriptionZh: "使用 calendar.calendar.list 查询日历列表",
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.calendar.calendar.list(payload),
})
