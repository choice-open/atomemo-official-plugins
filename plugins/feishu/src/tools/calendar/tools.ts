import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuCalendarAddEventAttendeesTool } from "./calendar-add-event-attendees"
import { feishuCalendarBatchGetCalendarsTool } from "./calendar-batch-get-calendars"
import { feishuCalendarBatchGetPrimaryTool } from "./calendar-batch-get-primary"
import { feishuCalendarCreateEventTool } from "./calendar-create-event"
import { feishuCalendarCreateExchangeBindingTool } from "./calendar-create-exchange-binding"
import { feishuCalendarCreateSharedCalendarTool } from "./calendar-create-shared-calendar"
import { feishuCalendarCreateTimeoffTool } from "./calendar-create-timeoff"
import { feishuCalendarDeleteCalendarTool } from "./calendar-delete-calendar"
import { feishuCalendarDeleteEventTool } from "./calendar-delete-event"
import { feishuCalendarDeleteTimeoffTool } from "./calendar-delete-timeoff"
import { feishuCalendarGetCalendarTool } from "./calendar-get-calendar"
import { feishuCalendarGetEventTool } from "./calendar-get-event"
import { feishuCalendarGetPrimaryTool } from "./calendar-get-primary"
import { feishuCalendarListCalendarsTool } from "./calendar-list-calendars"
import { feishuCalendarListEventAttendeesTool } from "./calendar-list-event-attendees"
import { feishuCalendarListEventsTool } from "./calendar-list-events"
import { feishuCalendarListExchangeBindingsTool } from "./calendar-list-exchange-bindings"
import { feishuCalendarPatchCalendarTool } from "./calendar-patch-calendar"
import { feishuCalendarPatchEventTool } from "./calendar-patch-event"
import { feishuCalendarRemoveEventAttendeeTool } from "./calendar-remove-event-attendee"
import { feishuCalendarSearchCalendarsTool } from "./calendar-search-calendars"
import { feishuCalendarSearchEventsTool } from "./calendar-search-events"
import { feishuCalendarSubscribeTool } from "./calendar-subscribe"
import { feishuCalendarUnsubscribeTool } from "./calendar-unsubscribe"

export * from "./calendar-add-event-attendees"
export * from "./calendar-batch-get-calendars"
export * from "./calendar-batch-get-primary"
export * from "./calendar-create-event"
export * from "./calendar-create-exchange-binding"
export * from "./calendar-create-shared-calendar"
export * from "./calendar-create-timeoff"
export * from "./calendar-delete-calendar"
export * from "./calendar-delete-event"
export * from "./calendar-delete-timeoff"
export * from "./calendar-get-calendar"
export * from "./calendar-get-event"
export * from "./calendar-get-primary"
export * from "./calendar-list-calendars"
export * from "./calendar-list-event-attendees"
export * from "./calendar-list-events"
export * from "./calendar-list-exchange-bindings"
export * from "./calendar-patch-calendar"
export * from "./calendar-patch-event"
export * from "./calendar-remove-event-attendee"
export * from "./calendar-search-calendars"
export * from "./calendar-search-events"
export * from "./calendar-subscribe"
export * from "./calendar-unsubscribe"

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
  feishuCalendarSubscribeTool,
  feishuCalendarUnsubscribeTool,
  feishuCalendarListEventAttendeesTool,
  feishuCalendarAddEventAttendeesTool,
  feishuCalendarRemoveEventAttendeeTool,
  feishuCalendarCreateTimeoffTool,
  feishuCalendarDeleteTimeoffTool,
  feishuCalendarCreateExchangeBindingTool,
  feishuCalendarListExchangeBindingsTool,
]
