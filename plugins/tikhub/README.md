# TikHub Atomemo Plugin

[English](#english) | [简体中文](#简体中文)

<a id="english"></a>

## English

[TikHub](https://www.tikhub.io/) provides third-party APIs for retrieving data
from multiple social media platforms. This plugin connects Atomemo to TikHub
for social listening, content research, lead discovery, and competitor
analysis workflows.

The plugin returns TikHub's upstream JSON responses. It does not normalize or
persist the data, run scheduled monitoring, or perform sentiment analysis,
lead scoring, or competitor scoring.

### Supported Platforms

The table lists only platforms currently registered by the plugin. Detailed
guides document tool IDs, parameters, pagination, identifier handling, and
recommended call chains where a local guide is available.

| Platform | TikHub API family | Main capabilities | Guide |
| --- | --- | --- | --- |
| Xiaohongshu / RedNote | App V2 | Note search, topic feeds, image and video note details, comments and replies | [TikHub API reference](https://api.tikhub.io/) |
| LinkedIn | Web | People and post search, user and company profiles, contact details, post comments and replies | [TikHub API reference](https://api.tikhub.io/) |
| Douyin | App V3 and Search | Content, user, topic, image, live, and music search; video details, statistics, comments, and replies | [TikHub API reference](https://api.tikhub.io/) |
| TikTok | App V3 | General, video, user, hashtag, and music search; video details, user posts, comments, and replies | [TikTok guide](docs/api/tiktok-app-v3.md) |
| Twitter / X | Web | Keyword search, tweet details, comments, profiles, trends, retweets, followers, and followings | [Twitter guide](docs/api/twitter-web.md) |
| YouTube | Web V2 and Web | General, Shorts, and channel search; video details, captions, comments, channel videos, and trends | [YouTube guide](docs/api/youtube-analysis.md) |
| Weibo | Web V2 and App | Advanced and real-time search, hot topics, post details, comments, profiles, user posts, and repost propagation | [Weibo guide](docs/api/weibo-analysis.md) |
| WeChat | Search V2, Channels V2, and Media Platform V2 | Search, Channels profiles and videos, Official Account articles, statistics, comments, and replies | [WeChat guide](docs/api/wechat-analysis.md) |
| Reddit | App | Keyword and trending search, post details, comment trees, subreddit feeds, and user activity | [Reddit guide](docs/api/reddit-analysis.md) |
| Instagram | V1 | Search, hashtag posts, post details, comments, profiles, posts, reels, and tagged posts | [Instagram guide](docs/api/instagram-v1-analysis.md) |
| Toutiao | App | Article and video details, comments, user ID resolution, and user profiles | [Toutiao guide](docs/api/toutiao-app-analysis.md) |
| Bilibili | Web | Keyword search, video details, comments, replies, danmaku, subtitles, profiles, and user content | [Bilibili guide](docs/api/bilibili-analysis.md) |
| Kuaishou | App | Video, user, and tag search; video details, comments, profiles, user videos, and hot boards | [Kuaishou guide](docs/api/kuaishou-app-analysis.md) |

### Common Workflows

- **Content monitoring:** search by keyword, retrieve selected content details,
  then fetch comments and replies.
- **Account and competitor research:** discover a user, retrieve the profile,
  then inspect historical posts and selected content interactions.
- **Trend discovery:** retrieve hot boards, trending topics, hashtags, or topic
  feeds, then use relevant terms in platform search tools.
- **Video understanding:** retrieve video details, then fetch captions,
  subtitles, or danmaku on platforms where those tools are available, such as
  YouTube and Bilibili.
- **Known-link analysis:** submit a supported share link, retain the returned
  content ID as a string, then use it for details, comments, and replies.

### Tools and Documentation

TikHub exposes many platform-specific tools, so this README serves as a
capability map instead of duplicating the complete tool catalog. Use the
platform guides above and the tool forms in Atomemo for exact tool IDs,
parameters, defaults, pagination rules, and supported expressions.

### Credential

Configure one `tikhub-api-key` credential with:

- `api_key` — required encrypted TikHub API key

The same credential can be used by every platform in this plugin.

### Authentication Setup

1. Sign in to the [TikHub user dashboard](https://user.tikhub.io/).
2. Create or copy an API key for the account Atomemo should use.
3. Create a **TikHub API Key** credential in Atomemo and enter the key in the
   encrypted **API Key** field.
4. Confirm that the account has sufficient balance for the endpoints in your
   workflow.

Never commit an API key, place it in ordinary workflow parameters, or include
it in logs, screenshots, or support messages.

### Usage Notes

- Pass long content, comment, and user IDs as strings to avoid JavaScript
  precision loss.
- Treat cursors, tokens, and `pcursor` values as opaque strings. For the next
  page, pass the value from the previous response unchanged.
- TikHub endpoints may have different prices. Check the dashboard for current
  pricing before running high-volume or higher-priced requests.
- Requests currently use `https://api.tikhub.io` as the base URL.
- Responses retain TikHub's upstream structure, which may change as TikHub or
  the source platform evolves.
- The plugin does not download or play media. Raw upstream responses may still
  contain media URLs.

### Development

```bash
bun install
bun run typecheck
bun test
bun run build
```

### Disclaimer

TikHub is a third-party service and is not the official API of the supported
social media platforms. You are responsible for complying with TikHub's terms,
the source platforms' terms, and applicable privacy and data regulations. API
availability, pricing, quotas, and response fields are controlled by TikHub
and may change.

---

<a id="简体中文"></a>

## 简体中文

[TikHub](https://www.tikhub.io/) 提供用于获取多个社交媒体平台数据的第三方
API。本插件将 Atomemo 连接到 TikHub，适用于社媒舆情监测、内容研究、客资发现
和竞品分析等工作流。

插件直接返回 TikHub 的上游 JSON 响应，不负责数据标准化或持久化，也不内置定时
监测、情感分析、客资评分或竞品评分。

### 支持的平台

下表只列出插件当前已注册的平台。本地专题文档会进一步说明 Tool ID、参数、分页、
标识符处理方式和推荐调用链。

| 平台 | TikHub API 系列 | 主要能力 | 文档 |
| --- | --- | --- | --- |
| 小红书 / RedNote | App V2 | 笔记搜索、话题信息与内容流、图文和视频笔记详情、评论与回复 | [TikHub API 参考](https://api.tikhub.io/) |
| LinkedIn | Web | 用户和帖子搜索、个人和公司资料、联系方式、帖子评论与回复 | [TikHub API 参考](https://api.tikhub.io/) |
| 抖音 | App V3 和 Search | 内容、用户、话题、图片、直播和音乐搜索；视频详情、统计、评论与回复 | [TikHub API 参考](https://api.tikhub.io/) |
| TikTok | App V3 | 综合、视频、用户、标签和音乐搜索；视频详情、用户作品、评论与回复 | [TikTok 文档](docs/api/tiktok-app-v3.md) |
| Twitter / X | Web | 关键词搜索、推文详情、评论、用户资料、趋势、转推用户、粉丝与关注列表 | [Twitter 文档](docs/api/twitter-web.md) |
| YouTube | Web V2 和 Web | 综合、Shorts 和频道搜索；视频详情、字幕、评论、频道视频和趋势内容 | [YouTube 文档](docs/api/youtube-analysis.md) |
| 微博 | Web V2 和 App | 高级和实时搜索、热搜、微博详情、评论、用户资料、用户微博和转发传播 | [微博文档](docs/api/weibo-analysis.md) |
| 微信 | Search V2、Channels V2 和 Media Platform V2 | 微信搜索、视频号资料和视频、公众号文章、统计、评论与回复 | [微信文档](docs/api/wechat-analysis.md) |
| Reddit | App | 关键词和趋势搜索、帖子详情、评论树、社区内容流和用户活动 | [Reddit 文档](docs/api/reddit-analysis.md) |
| Instagram | V1 | 搜索、标签帖子、帖子详情、评论、用户资料、帖子、Reels 和被标记帖子 | [Instagram 文档](docs/api/instagram-v1-analysis.md) |
| 今日头条 | App | 文章和视频详情、评论、用户 ID 解析和用户资料 | [今日头条文档](docs/api/toutiao-app-analysis.md) |
| Bilibili | Web | 关键词搜索、视频详情、评论与回复、弹幕、字幕、用户资料和用户内容 | [Bilibili 文档](docs/api/bilibili-analysis.md) |
| 快手 | App | 视频、用户和标签搜索；视频详情、评论、用户资料、用户作品和热榜 | [快手文档](docs/api/kuaishou-app-analysis.md) |

### 常见工作流

- **内容监测：**通过关键词搜索内容，获取选中内容的详情，再获取评论和回复。
- **账号和竞品研究：**发现目标用户，获取用户资料，再分析历史内容和重点内容互动。
- **趋势发现：**获取热榜、趋势话题、标签或话题内容流，再将相关词用于平台搜索。
- **视频内容理解：**先获取视频详情，再在支持的平台获取字幕、文本字幕或弹幕，例如
  YouTube 和 Bilibili。
- **已知链接分析：**提交平台支持的分享链接，将返回的内容 ID 保持为字符串，再用于
  获取详情、评论和回复。

### 工具与文档

TikHub 包含大量平台专用 Tool，因此 README 只作为能力地图，不重复维护完整 Tool
清单。准确的 Tool ID、参数、默认值、分页规则和表达式支持情况，请查看上方的平台
文档以及 Atomemo 中的 Tool 表单。

### 凭证

配置一个 `tikhub-api-key` 凭证，其中包含：

- `api_key`：必填的加密 TikHub API Key

插件内所有平台可以共用同一个凭证。

### 认证配置

1. 登录 [TikHub 用户后台](https://user.tikhub.io/)。
2. 为 Atomemo 使用的账户创建或复制 API Key。
3. 在 Atomemo 中创建 **TikHub API 密钥**凭证，将密钥填入加密的 **API Key**
   字段。
4. 确认账户余额足以支付工作流中使用的接口。

不要将 API Key 提交到代码仓库、放入普通工作流参数，或写入日志、截图和支持消息。

### 使用须知

- 内容、评论和用户等长 ID 必须作为字符串传递，避免 JavaScript 数字精度丢失。
- Cursor、token 和 `pcursor` 都是不透明字符串。获取下一页时，应原样传入上一页
  响应返回的值。
- 不同 TikHub 接口的价格可能不同。执行高频或高价请求前，应在用户后台确认当前
  价格。
- 插件当前使用 `https://api.tikhub.io` 作为请求 Base URL。
- 插件保留 TikHub 上游响应结构；TikHub 或源平台变化时，响应字段也可能变化。
- 插件不负责下载或播放媒体，但上游原始响应中仍可能包含媒体 URL。

### 开发

```bash
bun install
bun run typecheck
bun test
bun run build
```

### 免责声明

TikHub 是第三方服务，并非所支持社交媒体平台的官方 API。使用者有责任遵守 TikHub
服务条款、源平台条款以及适用的隐私和数据法规。API 可用性、价格、额度和响应字段
由 TikHub 控制，可能随时变化。
