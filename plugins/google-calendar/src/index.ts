import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { googleCalendarOAuth2Credential } from "./credentials/google-calendar-oauth2"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { createEventTool } from "./tools/create-event"
import { deleteEventTool } from "./tools/delete-event"
import { getEventTool } from "./tools/get-event"
import { listCalendarsTool } from "./tools/list-calendars"
import { listEventsTool } from "./tools/list-events"
import { updateEventTool } from "./tools/update-event"

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
plugin.addTool(listCalendarsTool)
plugin.addTool(listEventsTool)
plugin.addTool(createEventTool)
plugin.addTool(getEventTool)
plugin.addTool(updateEventTool)
plugin.addTool(deleteEventTool)

plugin.run()
