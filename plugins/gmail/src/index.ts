import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { gmailOAuthCredential } from "./credentials/gmail-oauth"
import { getProfileTool } from "./tools/get-profile"
import { listMessagesTool } from "./tools/list-messages"
import { getMessageTool } from "./tools/get-message"
import { sendMessageTool } from "./tools/send-message"
// import { deleteMessageTool } from "./tools/delete-message"
import { trashMessageTool } from "./tools/trash-message"
import { untrashMessageTool } from "./tools/untrash-message"
import { modifyMessageTool } from "./tools/modify-message"
import { batchModifyMessagesTool } from "./tools/batch-modify-messages"
// import { batchDeleteMessagesTool } from "./tools/batch-delete-messages"
import { downloadAttachmentTool } from "./tools/download-attachment"
import { listDraftsTool } from "./tools/list-drafts"
import { getDraftTool } from "./tools/get-draft"
import { createDraftTool } from "./tools/create-draft"
import { sendDraftTool } from "./tools/send-draft"
import { deleteDraftTool } from "./tools/delete-draft"
import { updateDraftTool } from "./tools/update-draft"
import { listLabelsTool } from "./tools/list-labels"
import { getLabelTool } from "./tools/get-label"
import { createLabelTool } from "./tools/create-label"
import { updateLabelTool } from "./tools/update-label"
import { deleteLabelTool } from "./tools/delete-label"
import { listThreadsTool } from "./tools/list-threads"
import { getThreadTool } from "./tools/get-thread"
import { modifyThreadTool } from "./tools/modify-thread"
import { trashThreadTool } from "./tools/trash-thread"
import { untrashThreadTool } from "./tools/untrash-thread"
// import { deleteThreadTool } from "./tools/delete-thread"
import { listHistoryTool } from "./tools/list-history"
// import { watchTool } from "./tools/watch"
// import { stopTool } from "./tools/stop"
// import { getVacationTool } from "./tools/get-vacation"
// import { updateVacationTool } from "./tools/update-vacation"
// import { listDelegatesTool } from "./tools/list-delegates"
import { listFiltersTool } from "./tools/list-filters"
import { listSendAsTool } from "./tools/list-send-as"
import { listForwardingAddressesTool } from "./tools/list-forwarding-addresses"
import { getAttachmentTool } from "./tools/get-attachment"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "📧",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/gmail",
  locales,
  transporterOptions: {},
})

plugin.addCredential(gmailOAuthCredential)

plugin.addTool(getProfileTool)
plugin.addTool(listMessagesTool)
plugin.addTool(getMessageTool)
plugin.addTool(sendMessageTool)
// plugin.addTool(deleteMessageTool)
plugin.addTool(trashMessageTool)
plugin.addTool(untrashMessageTool)
plugin.addTool(modifyMessageTool)
plugin.addTool(batchModifyMessagesTool)
// plugin.addTool(batchDeleteMessagesTool)
plugin.addTool(downloadAttachmentTool)
// plugin.addTool(getAttachmentTool)
plugin.addTool(listDraftsTool)
plugin.addTool(getDraftTool)
plugin.addTool(createDraftTool)
plugin.addTool(sendDraftTool)
plugin.addTool(deleteDraftTool)
plugin.addTool(updateDraftTool)
plugin.addTool(listLabelsTool)
plugin.addTool(getLabelTool)
plugin.addTool(createLabelTool)
plugin.addTool(updateLabelTool)
plugin.addTool(deleteLabelTool)
plugin.addTool(listThreadsTool)
plugin.addTool(getThreadTool)
plugin.addTool(modifyThreadTool)
plugin.addTool(trashThreadTool)
plugin.addTool(untrashThreadTool)
// plugin.addTool(deleteThreadTool)
plugin.addTool(listHistoryTool)
// plugin.addTool(watchTool)
// plugin.addTool(stopTool)
// plugin.addTool(getVacationTool)
// plugin.addTool(updateVacationTool)
// plugin.addTool(listDelegatesTool)
plugin.addTool(listFiltersTool)
plugin.addTool(listSendAsTool)
plugin.addTool(listForwardingAddressesTool)

plugin.run()
