import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { tikhubApiKeyCredential } from "./credentials/tikhub-api-key"
import { allTools } from "./tools"

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: {
    en_US: "TikHub",
    zh_Hans: "TikHub 社交媒体数据",
  },
  description: {
    en_US: "Multi-platform social media data via TikHub API.",
    zh_Hans: "通过 TikHub API 提供多平台社交媒体数据。",
  },
  icon: "📕",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/tikhub",
  transporterOptions: {},
})

plugin.addCredential(tikhubApiKeyCredential)
for (const tool of allTools) {
  plugin.addTool(tool)
}

plugin.run()
