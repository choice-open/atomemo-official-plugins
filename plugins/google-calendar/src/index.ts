import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { googleCalendarOAuth2Credential } from "./credentials/google-calendar-oauth2"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { clearCalendarTool } from "./tools/calendar/clear-calendar"
import { createCalendarTool } from "./tools/calendar/create-calendar"
import { deleteCalendarTool } from "./tools/calendar/delete-calendar"
import { getCalendarTool } from "./tools/calendar/get-calendar"
import { updateCalendarTool } from "./tools/calendar/update-calendar"
import { deleteCalendarListTool } from "./tools/calendar-list/delete-calendars"
import { getCalendarListTool } from "./tools/calendar-list/get-calendars"
import { insertCalendarListTool } from "./tools/calendar-list/insert-calendar-list"
import { listCalendarsTool } from "./tools/calendar-list/list-calendars"
import { updateCalendarListTool } from "./tools/calendar-list/update-calendar-list"
import { getColorsTool } from "./tools/colors/get-colors"
import { createEventTool } from "./tools/event/create-event"
import { deleteEventTool } from "./tools/event/delete-event"
import { getEventTool } from "./tools/event/get-event"
import { listEventInstancesTool } from "./tools/event/list-event-instances"
import { listEventsTool } from "./tools/event/list-events"
import { moveEventTool } from "./tools/event/move-event"
import { quickAddEventTool } from "./tools/event/quick-add-event"
import { updateEventTool } from "./tools/event/update-event"
import { queryFreebusyTool } from "./tools/freebusy/query-freebusy"
import { getSettingTool } from "./tools/settings/get-setting"
import { listSettingsTool } from "./tools/settings/list-settings"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "📅",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/google-calendar",
  locales,
  transporterOptions: {},
})

plugin.addCredential(googleCalendarOAuth2Credential)

// Calendars API
plugin.addTool(getCalendarTool)
plugin.addTool(createCalendarTool)
plugin.addTool(updateCalendarTool)
plugin.addTool(deleteCalendarTool)
plugin.addTool(clearCalendarTool)

// CalendarList API
plugin.addTool(listCalendarsTool)
plugin.addTool(getCalendarListTool)
plugin.addTool(insertCalendarListTool)
plugin.addTool(updateCalendarListTool)
plugin.addTool(deleteCalendarListTool)

// Events API
plugin.addTool(listEventsTool)
plugin.addTool(createEventTool)
plugin.addTool(getEventTool)
plugin.addTool(updateEventTool)
plugin.addTool(deleteEventTool)
plugin.addTool(listEventInstancesTool)
plugin.addTool(moveEventTool)
plugin.addTool(quickAddEventTool)

// Settings API
plugin.addTool(getSettingTool)
plugin.addTool(listSettingsTool)

// Colors API
plugin.addTool(getColorsTool)

// FreeBusy API
plugin.addTool(queryFreebusyTool)

plugin.run()
