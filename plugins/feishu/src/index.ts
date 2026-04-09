import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js";
import packageJSON from "../package.json";
import { feishuAppCredential } from "./credentials/feishu-app-credential";
import { t } from "./i18n/i18n-node";
import { locales } from "./i18n/i18n-util";
import { loadAllLocalesAsync } from "./i18n/i18n-util.async";
import * as feishuTools from "./tools/index";

await loadAllLocalesAsync();

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "",
  locales,
  transporterOptions: {},
});

plugin.addTool(feishuTools.userCreateTool);
plugin.addTool(feishuTools.userUpdateTool);
plugin.addTool(feishuTools.userResignTool);
plugin.addTool(feishuTools.userBatchGetTool);
plugin.addTool(feishuTools.userListTool);
plugin.addTool(feishuTools.userSearchTool);
plugin.addTool(feishuTools.departmentCreateTool);
plugin.addTool(feishuTools.departmentUpdateTool);
plugin.addTool(feishuTools.departmentDeleteTool);
plugin.addTool(feishuTools.departmentBatchGetTool);
plugin.addTool(feishuTools.departmentListTool);
plugin.addTool(feishuTools.departmentSearchTool);
plugin.addTool(feishuTools.messageSendTool);
plugin.addTool(feishuTools.messageBatchSendTool);
plugin.addTool(feishuTools.imageUploadTool);
plugin.addTool(feishuTools.imageDownloadTool);
plugin.addTool(feishuTools.fileUploadTool);
plugin.addTool(feishuTools.fileDownloadTool);
plugin.addTool(feishuTools.calendarSharedCreateTool);
plugin.addTool(feishuTools.calendarSharedDeleteTool);
plugin.addTool(feishuTools.calendarPrimaryGetTool);
plugin.addTool(feishuTools.calendarPrimaryBatchGetTool);
plugin.addTool(feishuTools.calendarGetTool);
plugin.addTool(feishuTools.calendarBatchGetTool);
plugin.addTool(feishuTools.calendarListTool);
plugin.addTool(feishuTools.calendarUpdateTool);
plugin.addTool(feishuTools.calendarSearchTool);
plugin.addTool(feishuTools.eventCreateTool);
plugin.addTool(feishuTools.eventDeleteTool);
plugin.addTool(feishuTools.eventUpdateTool);
plugin.addTool(feishuTools.eventGetTool);
plugin.addTool(feishuTools.eventListTool);
plugin.addTool(feishuTools.eventSearchTool);

plugin.addCredential(feishuAppCredential);

plugin.run();
