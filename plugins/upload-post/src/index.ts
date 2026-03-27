import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { uploadPostCredential } from "./credentials/upload-post"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { getUploadStatusTool } from "./tools/get-upload-status"
import { uploadMediaTool } from "./tools/upload-media"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/upload-post",
  icon: "https://server-media-public.atomemo.ai/icons/upload-post.png",
  locales,
  transporterOptions: {},
})

plugin.addCredential(uploadPostCredential)

plugin.addTool(uploadMediaTool)
plugin.addTool(getUploadStatusTool)

plugin.run()
