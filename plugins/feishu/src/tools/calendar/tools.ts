import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuCalendarBatchGetCalendarsTool } from "./calendar-batch-get-calendars"
import { feishuCalendarBatchGetPrimaryTool } from "./calendar-batch-get-primary"
import { feishuCalendarCreateEventTool } from "./calendar-create-event"
import { feishuCalendarCreateSharedCalendarTool } from "./calendar-create-shared-calendar"
import { feishuCalendarDeleteCalendarTool } from "./calendar-delete-calendar"
import { feishuCalendarDeleteEventTool } from "./calendar-delete-event"
import { feishuCalendarGetCalendarTool } from "./calendar-get-calendar"
import { feishuCalendarGetEventTool } from "./calendar-get-event"
import { feishuCalendarGetPrimaryTool } from "./calendar-get-primary"
import { feishuCalendarListCalendarsTool } from "./calendar-list-calendars"
import { feishuCalendarListEventsTool } from "./calendar-list-events"
import { feishuCalendarPatchCalendarTool } from "./calendar-patch-calendar"
import { feishuCalendarPatchEventTool } from "./calendar-patch-event"
import { feishuCalendarSearchCalendarsTool } from "./calendar-search-calendars"
import { feishuCalendarSearchEventsTool } from "./calendar-search-events"

export * from "./calendar-batch-get-calendars"
export * from "./calendar-batch-get-primary"
export * from "./calendar-create-event"
export * from "./calendar-create-shared-calendar"
export * from "./calendar-delete-calendar"
export * from "./calendar-delete-event"
export * from "./calendar-get-calendar"
export * from "./calendar-get-event"
export * from "./calendar-get-primary"
export * from "./calendar-list-calendars"
export * from "./calendar-list-events"
export * from "./calendar-patch-calendar"
export * from "./calendar-patch-event"
export * from "./calendar-search-calendars"
export * from "./calendar-search-events"

/** 与 docs/日历.md + docs/日程.md 中 API 列表一致 */
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
  feishuCalendarCreateEventTool,
  feishuCalendarDeleteEventTool,
  feishuCalendarPatchEventTool,
  feishuCalendarGetEventTool,
  feishuCalendarListEventsTool,
  feishuCalendarSearchEventsTool,
]
