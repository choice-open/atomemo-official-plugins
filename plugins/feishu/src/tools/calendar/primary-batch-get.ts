import { createFeishuSdkTool, expectNestedArray } from "../feishu-base"
import primaryBatchGetSkill from "./primary-batch-get-skill.md" with {
  type: "text",
}

export const calendarPrimaryBatchGetTool = createFeishuSdkTool({
  name: "feishu_calendar_primary_batch_get",
  skill: primaryBatchGetSkill,
  displayNameEn: "Feishu Calendar Primary Batch Get",
  displayNameZh: "飞书批量获取主日历信息",
  descriptionEn: "Batch get primary calendars by calendar.calendar.primarys",
  descriptionZh: "使用 calendar.calendar.primarys 批量获取主日历信息",
  uiFields: [
    {
      name: "user_id_type",
      displayNameEn: "User ID Type",
      displayNameZh: "用户 ID 类型",
      target: "params",
      key: "user_id_type",
      placeholder: "open_id / user_id / union_id",
    },
  ],
  validatePayload: (payload) => {
    expectNestedArray(payload, "data", "user_ids")
  },
  invokeSdk: (client, payload) =>
    client.calendar.calendar.primarys(
      payload as unknown as Parameters<
        typeof client.calendar.calendar.primarys
      >[0],
    ),
})
