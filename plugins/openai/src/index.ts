import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { openaiCredential } from "./credentials/openai"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { gpt52Model } from "./models/gpt-5.2"
import { gpt52ProModel } from "./models/gpt-5.2-pro"
import { gpt52CodexModel } from "./models/gpt-5.2-codex"
import { gpt51Model } from "./models/gpt-5.1"
import { gpt51CodexModel } from "./models/gpt-5.1-codex"
import { gpt51CodexMaxModel } from "./models/gpt-5.1-codex-max"
import { gpt5Model } from "./models/gpt-5"
import { gpt5ProModel } from "./models/gpt-5-pro"
import { gpt5CodexModel } from "./models/gpt-5-codex"
import { gpt5MiniModel } from "./models/gpt-5-mini"
import { gpt5NanoModel } from "./models/gpt-5-nano"
import { gpt41Model } from "./models/gpt-4.1"
import { gpt41MiniModel } from "./models/gpt-4.1-mini"
import { gpt4oModel } from "./models/gpt-4o"
import { gpt4oMiniModel } from "./models/gpt-4o-mini"
import { gpt4oNanoModel } from "./models/gpt-4o-nano"
import { gptRealtimeModel } from "./models/gpt-realtime"
import { gptRealtimeMiniModel } from "./models/gpt-realtime-mini"
import { gptAudioModel } from "./models/gpt-audio"
import { gptAudioMiniModel } from "./models/gpt-audio-mini"
import { o1Model } from "./models/o1"
import { o1MiniModel } from "./models/o1-mini"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🤖",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/openai",
  locales,
  transporterOptions: {},
})

plugin.addCredential(openaiCredential)

plugin.addModel(gpt52Model)
plugin.addModel(gpt52ProModel)
plugin.addModel(gpt52CodexModel)
plugin.addModel(gpt51Model)
plugin.addModel(gpt51CodexModel)
plugin.addModel(gpt51CodexMaxModel)
plugin.addModel(gpt5Model)
plugin.addModel(gpt5ProModel)
plugin.addModel(gpt5CodexModel)
plugin.addModel(gpt5MiniModel)
plugin.addModel(gpt5NanoModel)
plugin.addModel(gpt41Model)
plugin.addModel(gpt41MiniModel)
plugin.addModel(gpt4oModel)
plugin.addModel(gpt4oMiniModel)
plugin.addModel(gpt4oNanoModel)
plugin.addModel(gptRealtimeModel)
plugin.addModel(gptRealtimeMiniModel)
plugin.addModel(gptAudioModel)
plugin.addModel(gptAudioMiniModel)
plugin.addModel(o1Model)
plugin.addModel(o1MiniModel)

plugin.run()
