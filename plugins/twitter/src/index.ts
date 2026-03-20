import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { twitterOAuthCredential } from "./credentials/twitter-oauth"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { createTweetTool } from "./tools/create-tweet"
import { deleteTweetTool } from "./tools/delete-tweet"
import { getFollowersTool } from "./tools/get-followers"
import { getFollowingTool } from "./tools/get-following"
import { getMeTool } from "./tools/get-me"
import { getTweetTool } from "./tools/get-tweet"
import { getUserTool } from "./tools/get-user"
import { getUserByUsernameTool } from "./tools/get-user-by-username"
import { getUserTweetsTool } from "./tools/get-user-tweets"
import { likeTweetTool } from "./tools/like-tweet"
import { retweetTool } from "./tools/retweet"
import { searchTweetsTool } from "./tools/search-tweets"
import { undoRetweetTool } from "./tools/undo-retweet"
import { unlikeTweetTool } from "./tools/unlike-tweet"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "https://server-media-public.atomemo.ai/icons/twitter-x.svg",
  lang: "typescript",
  version: packageJSON.version,
  repo: "",
  locales,
  transporterOptions: {},
})

plugin.addCredential(twitterOAuthCredential)

// Tweet management
plugin.addTool(createTweetTool)
plugin.addTool(deleteTweetTool)
plugin.addTool(getTweetTool)
plugin.addTool(searchTweetsTool)
plugin.addTool(getUserTweetsTool)

// User management
plugin.addTool(getMeTool)
plugin.addTool(getUserTool)
plugin.addTool(getUserByUsernameTool)
plugin.addTool(getFollowersTool)
plugin.addTool(getFollowingTool)

// Tweet interactions
plugin.addTool(likeTweetTool)
plugin.addTool(unlikeTweetTool)
plugin.addTool(retweetTool)
plugin.addTool(undoRetweetTool)

plugin.run()
