import { createFeishuSdkTool, expectNestedArray } from "../feishu-base"
import batchGetSkill from "./batch-get-skill.md" with { type: "text" }

export const calendarBatchGetTool = createFeishuSdkTool({
  name: "feishu_calendar_batch_get",
  skill: batchGetSkill,
  displayNameEn: "Feishu Calendar Batch Get",
  displayNameZh: "飞书批量查询日历信息",
  descriptionEn: "Batch get calendars by calendar.calendar.mget",
  descriptionZh: "使用 calendar.calendar.mget 批量查询日历信息",
  uiFields: [
    {
      name: "calendar_ids_json",
      displayNameEn: "Calendar IDs(JSON Array)",
      displayNameZh: "日历 ID 数组(JSON)",
      target: "data",
      key: "calendar_ids",
      valueType: "json",
      placeholder: '["cal_xxx","cal_yyy"]',
    },
    {
      name: "calendar_id_type",
      displayNameEn: "Calendar ID Type",
      displayNameZh: "日历 ID 类型",
      target: "params",
      key: "calendar_id_type",
      placeholder: "calendar_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "calendar_ids")
  },
  invokeSdk: (client, payload) =>
    client.calendar.calendar.mget(
      payload as unknown as Parameters<typeof client.calendar.calendar.mget>[0],
    ),
})
