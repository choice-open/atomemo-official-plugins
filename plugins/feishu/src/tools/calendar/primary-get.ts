import { createFeishuSdkTool } from "../feishu-base"
import primaryGetSkill from "./primary-get-skill.md" with { type: "text" }

export const calendarPrimaryGetTool = createFeishuSdkTool({
  name: "feishu_calendar_primary_get",
  skill: primaryGetSkill,
  displayNameEn: "Feishu Calendar Primary Get",
  displayNameZh: "飞书查询主日历信息",
  descriptionEn: "Get primary calendar by calendar.calendar.primary",
  descriptionZh: "使用 calendar.calendar.primary 查询主日历信息",
  validatePayload: (_payload) => {},
  invokeSdk: (client, payload) => client.calendar.calendar.primary(payload),
})
