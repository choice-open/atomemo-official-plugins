import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { douyinAppV3Tools } from "./douyin/app-v3"
import { douyinSearchTools } from "./douyin/search"
import { linkedinWebTools } from "./linkedin/web"
import { redditAppTools } from "./reddit/app"
import { tiktokAppV3Tools } from "./tiktok/app-v3"
import { twitterWebTools } from "./twitter/web"
import { wechatChannelsV2Tools } from "./wechat/channels-v2"
import { wechatMediaPlatformV2Tools } from "./wechat/media-platform-v2"
import { wechatSearchV2Tools } from "./wechat/search-v2"
import { weiboAppTools } from "./weibo/app"
import { weiboWebV2Tools } from "./weibo/web-v2"
import { xiaohongshuAppV2Tools } from "./xiaohongshu/app-v2"
import { youtubeWebTools } from "./youtube/web"
import { youtubeWebV2Tools } from "./youtube/web-v2"

export const allTools: ToolDefinition[] = [
  ...xiaohongshuAppV2Tools,
  ...linkedinWebTools,
  ...douyinSearchTools,
  ...douyinAppV3Tools,
  ...tiktokAppV3Tools,
  ...twitterWebTools,
  ...youtubeWebV2Tools,
  ...youtubeWebTools,
  ...weiboWebV2Tools,
  ...weiboAppTools,
  ...wechatSearchV2Tools,
  ...wechatChannelsV2Tools,
  ...wechatMediaPlatformV2Tools,
  ...redditAppTools,
]
