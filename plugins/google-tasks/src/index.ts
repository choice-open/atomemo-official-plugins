import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { googleTasksOAuth2Credential } from "./credentials/google-tasks-oauth2"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { createTaskListTool } from "./tools/task-lists/create-task-list"
import { deleteTaskListTool } from "./tools/task-lists/delete-task-list"
import { listTaskListsTool } from "./tools/task-lists/list-task-lists"
import { updateTaskListTool } from "./tools/task-lists/update-task-list"
import { clearCompletedTasksTool } from "./tools/tasks/clear-completed-tasks"
import { createTaskTool } from "./tools/tasks/create-task"
import { deleteTaskTool } from "./tools/tasks/delete-task"
import { getTaskTool } from "./tools/tasks/get-task"
import { listTasksTool } from "./tools/tasks/list-tasks"
import { moveTaskTool } from "./tools/tasks/move-task"
import { updateTaskTool } from "./tools/tasks/update-task"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "link:google-tasks",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/google-tasks",
  locales,
  transporterOptions: {},
})

plugin.addCredential(googleTasksOAuth2Credential)

plugin.addTool(listTaskListsTool)
plugin.addTool(createTaskListTool)
plugin.addTool(updateTaskListTool)
plugin.addTool(deleteTaskListTool)

plugin.addTool(listTasksTool)
plugin.addTool(getTaskTool)
plugin.addTool(createTaskTool)
plugin.addTool(updateTaskTool)
plugin.addTool(deleteTaskTool)
plugin.addTool(moveTaskTool)
plugin.addTool(clearCompletedTasksTool)

plugin.run()
