import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { dingtalkAppCredential } from "./credentials"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { t } from "./lib/i18n"
import { getAppAccessTokenTool } from "./tools/auth/get-app-access-token"
import { batchSendRobotMessageTool } from "./tools/robots/batch-send-robot-message"
import { sendGroupRobotMessageTool } from "./tools/robots/send-group-robot-message"
import { getUserTool } from "./tools/users/get-user"
import { getUserByMobileTool } from "./tools/users/get-user-by-mobile"
import { searchUsersTool } from "./tools/users/search-users"
import { addProcessCommentTool } from "./tools/workflows/add-process-comment"
import { downloadProcessAttachmentTool } from "./tools/workflows/download-process-attachment"
import { executeProcessTaskTool } from "./tools/workflows/execute-process-task"
import { getProcessInstanceTool } from "./tools/workflows/get-process-instance"
import { getProcessSpaceInfoTool } from "./tools/workflows/get-process-space-info"
import { listProcessInstanceIdsTool } from "./tools/workflows/list-process-instance-ids"
import { listVisibleProcessTemplatesTool } from "./tools/workflows/list-visible-process-templates"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-dingtalk",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/dingtalk",
  locales,
  transporterOptions: {},
})

plugin.addCredential(dingtalkAppCredential)

for (const tool of [
  getAppAccessTokenTool,
  batchSendRobotMessageTool,
  sendGroupRobotMessageTool,
  getUserTool,
  getUserByMobileTool,
  searchUsersTool,
  getProcessInstanceTool,
  addProcessCommentTool,
  executeProcessTaskTool,
  downloadProcessAttachmentTool,
  listProcessInstanceIdsTool,
  getProcessSpaceInfoTool,
  listVisibleProcessTemplatesTool,
]) {
  plugin.addTool(tool)
}

plugin.run()
