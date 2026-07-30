# WeChat Analysis Tools

TikHub WeChat analysis tools cover three related API groups in one release unit:
WeChat Search V2, WeChat Channels V2, and WeChat Media Platform V2.

All tools use the shared `tikhub-api-key` credential and send POST requests with
business parameters in the JSON request body. WeChat endpoints may take about 30
seconds to respond, especially when fetching comment or account-history data.

`raw=true` is the OpenAPI default for every tool. For analysis workflows, set
`raw=false` when available to request TikHub's simplified structure with flatter
items.

## WeChat Search / 微信搜一搜

- `tikhub_wechat_search_fetch_search`
  - POST `/api/v1/wechat_search/v2/fetch_search`
  - Searches official accounts, articles, Channels videos, news, images, and
    other verticals.
  - `business_type` uses string values such as `all`, `account`, `article`, and
    `video`.
  - Pagination: use `offset=0` for the first request. For later pages, pass the
    response `cursor` unchanged and keep filters such as `sort` and
    `publish_time` unchanged.

- `tikhub_wechat_search_videos`
  - POST `/api/v1/wechat_search/v2/fetch_search_videos`
  - Searches WeChat Channels videos with `duration`, `sort`, and
    `publish_time` string filters.
  - Pagination uses the response `cursor`; offset alone does not paginate.
  - Treat `exportId` and `feedNonceId` from results as strings.

## WeChat Channels / 微信视频号

- `tikhub_wechat_channels_video_detail`
  - POST `/api/v1/wechat_channels/v2/fetch_video_detail`
  - Looks up a Channels video by `object_id`, `export_id`, or `share_url`.
  - Priority is `object_id` > `export_id` > `share_url`.
  - `export_id` can expire, so call detail soon after search.

- `tikhub_wechat_channels_comments`
  - POST `/api/v1/wechat_channels/v2/fetch_video_comments`
  - Fetches first-level comments when `comment_id` is empty.
  - Fetches replies for a specific comment when `comment_id` is provided.
  - Pagination uses `last_buffer` from the previous response.

- `tikhub_wechat_channels_user_profile`
  - POST `/api/v1/wechat_channels/v2/fetch_user_profile`
  - Fetches a finder account profile and stats by `username`, usually
    `v2_...@finder`.

- `tikhub_wechat_channels_user_videos`
  - POST `/api/v1/wechat_channels/v2/fetch_user_videos`
  - Fetches historical videos for a finder account.
  - Pagination uses `last_buffer` unchanged.

No Channels tool downloads, decrypts, or exposes media files or playback URLs.

## WeChat Official Account / 微信公众号

- `tikhub_wechat_mp_account_profile`
  - POST `/api/v1/wechat_mp/v2/fetch_account_profile`
  - Fetches official account profile data by `gh_username`.

- `tikhub_wechat_mp_account_articles`
  - POST `/api/v1/wechat_mp/v2/fetch_account_articles`
  - Fetches historical official account content.
  - `page_size` defaults to 20 and is limited to 10-20.
  - `item_show_type`: `0` articles, `5` videos, `7` audio, `8` image-text posts.
  - Pagination uses the previous response `next_offset`.

- `tikhub_wechat_mp_article_detail`
  - POST `/api/v1/wechat_mp/v2/fetch_article_detail`
  - Fetches article body and metadata by URL.

- `tikhub_wechat_mp_article_stats`
  - POST `/api/v1/wechat_mp/v2/fetch_article_stats`
  - Fetches reads, likes, wow, and other interaction metrics by URL.

- `tikhub_wechat_mp_article_comments`
  - POST `/api/v1/wechat_mp/v2/fetch_article_comments`
  - Fetches first-level article comments.
  - Pagination uses the previous response `buffer`.

- `tikhub_wechat_mp_comment_replies`
  - POST `/api/v1/wechat_mp/v2/fetch_comment_replies`
  - Fetches replies for a first-level article comment.
  - `content_id` is optional; empty keeps TikHub's upstream behavior of choosing
    the first comment that has replies.
  - `offset` defaults to 0; when `has_more=true`, pass `next_offset`.
  - `all_pages=true` ignores `offset` and can increase latency and API cost.

## ID And Cursor Chains

Official account chain:

1. Use WeChat Search with `business_type=account`.
2. Read `jumpInfo.userName` as the `gh_username`.
3. Fetch account profile.
4. Fetch account articles.
5. Fetch article detail and stats.
6. Fetch article comments.
7. Fetch comment replies by `content_id`, or leave it empty for TikHub's default
   first-comment-with-replies behavior.

Channels chain:

1. Search Channels videos.
2. Read `exportId` and `feedNonceId` as strings.
3. Fetch video detail with `export_id`, and optionally `object_nonce_id`.
4. Read `object_id` and finder `username`.
5. Fetch video comments by `object_id`.
6. Fetch user profile and historical videos by finder `username`.

Pagination chain:

- Search tools: pass `cursor` unchanged and keep filters unchanged.
- Channels comments and user videos: pass `last_buffer` unchanged.
- Official account article list: pass `next_offset` as `offset`.
- Official account article comments: pass `buffer` unchanged.
- Official account comment replies: pass `next_offset` as `offset`.

All IDs such as `object_id`, `comment_id`, `content_id`, `exportId`, and
`feedNonceId` must be treated as strings. Do not convert them to JavaScript
numbers.

## Not Included

This release intentionally does not implement:

- Channels: channel id conversion, channel info, collections, live detail, live
  history, search channel videos, user collections, or video share URL tools.
- Official account: account services, article ads, or related articles.
- Media download, decryption, playback URL extraction, live replay, advertising
  extraction, custom menu extraction, collection management, `file_ref` media
  output, summarization, sentiment analysis, lead scoring, or persistence.
