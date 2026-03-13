import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { googleDriveOAuthCredential } from "./credentials"
import { t } from "./i18n/i18n-node"
import { downloadAFileTool, uploadAFileTool } from "./tools"

const locales = ["en-US", "zh-Hans"] as const

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-google-drive",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/google-drive",
  locales: [...locales],
  transporterOptions: {},
})

plugin.addCredential(googleDriveOAuthCredential)
plugin.addTool(downloadAFileTool)
plugin.addTool(uploadAFileTool)

plugin.run()
