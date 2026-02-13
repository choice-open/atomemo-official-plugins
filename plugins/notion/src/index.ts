import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js";
import packageJSON from "../package.json";
import { secretCredential } from "./credentials/secret";
import { t } from "./i18n/i18n-node";
import { locales } from "./i18n/i18n-util";
import { loadAllLocalesAsync } from "./i18n/i18n-util.async";
import {
  appendBlocksTool,
  createAPageInADatabaseTool,
  createAPageTool,
  getADatabaseTool,
  getAPageInADatabaseTool,
  getChildBlocksTool,
  getManyPagesInADatabaseTool,
  searchDatabasesTool,
  searchPagesTool,
  updateAPageInADatabaseTool,
} from "./tools";

await loadAllLocalesAsync();

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-notion", // notion icon is builtin in Atomemo
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/notion",
  locales,
  transporterOptions: {},
});

plugin.addTool(appendBlocksTool);
plugin.addTool(createAPageInADatabaseTool);
plugin.addTool(createAPageTool);
plugin.addTool(updateAPageInADatabaseTool);
plugin.addTool(getADatabaseTool);
plugin.addTool(getAPageInADatabaseTool);
plugin.addTool(getChildBlocksTool);
plugin.addTool(getManyPagesInADatabaseTool);
plugin.addTool(searchDatabasesTool);
plugin.addTool(searchPagesTool);

plugin.addCredential(secretCredential);

plugin.run();
