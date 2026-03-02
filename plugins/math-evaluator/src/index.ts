import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { mathEvaluatorTool } from "./tools/math-evaluator"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🔢",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/math-evaluator",
  locales,
  transporterOptions: {},
})

plugin.addTool(mathEvaluatorTool)

plugin.run()
