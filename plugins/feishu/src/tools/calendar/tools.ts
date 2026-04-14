import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuCalendarBatchGetCalendarsTool } from "./calendar-batch-get-calendars"
import { feishuCalendarBatchGetPrimaryTool } from "./calendar-batch-get-primary"
import { feishuCalendarCreateSharedCalendarTool } from "./calendar-create-shared-calendar"
import { feishuCalendarDeleteCalendarTool } from "./calendar-delete-calendar"
import { feishuCalendarGetCalendarTool } from "./calendar-get-calendar"
import { feishuCalendarGetPrimaryTool } from "./calendar-get-primary"
import { feishuCalendarListCalendarsTool } from "./calendar-list-calendars"
import { feishuCalendarPatchCalendarTool } from "./calendar-patch-calendar"
import { feishuCalendarSearchCalendarsTool } from "./calendar-search-calendars"

export * from "./calendar-batch-get-calendars"
export * from "./calendar-batch-get-primary"
export * from "./calendar-create-shared-calendar"
export * from "./calendar-delete-calendar"
export * from "./calendar-get-calendar"
export * from "./calendar-get-primary"
export * from "./calendar-list-calendars"
export * from "./calendar-patch-calendar"
export * from "./calendar-search-calendars"

/** 与 docs/日历.md 中「日历」API 列表一致 */
export const calendarTools: ToolDefinition[] = [
  feishuCalendarCreateSharedCalendarTool,
  feishuCalendarDeleteCalendarTool,
  feishuCalendarGetPrimaryTool,
  feishuCalendarBatchGetPrimaryTool,
  feishuCalendarGetCalendarTool,
  feishuCalendarBatchGetCalendarsTool,
  feishuCalendarListCalendarsTool,
  feishuCalendarPatchCalendarTool,
  feishuCalendarSearchCalendarsTool,
]
