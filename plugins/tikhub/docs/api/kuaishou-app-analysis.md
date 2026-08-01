# Kuaishou App Analysis Tools

TikHub Kuaishou App analysis tools provide compact workflows for video and
topic monitoring, account research, competitor analysis, and hot-topic
discovery.

This release includes 12 GET endpoints from `Kuaishou-App-API`. All tools use
the shared `tikhub-api-key` credential, send business parameters as query
parameters, and return TikHub responses as-is. The four V2 endpoints
(`search_video_v2`, `search_user_v2`, `fetch_one_user_v2`, and
`fetch_user_post_v2`) are more stable but higher-priced. Check the TikHub
dashboard for current prices before use; no fixed amount is assumed here.

## Tools

- `tikhub_kuaishou_video_search`
  - GET `/api/v1/kuaishou/app/search_video_v2`
  - Requires `keyword`; `pcursor` defaults to an empty string.
- `tikhub_kuaishou_user_search`
  - GET `/api/v1/kuaishou/app/search_user_v2`
  - Requires `keyword`; supports `user_relation`, `user_gender`, and
    `fans_sort` filters.
- `tikhub_kuaishou_tag_search`
  - GET `/api/v1/kuaishou/app/search_tag`
  - Requires `keyword` and returns tag names or numeric tag IDs for tag feeds.
- `tikhub_kuaishou_tag_feed`
  - GET `/api/v1/kuaishou/app/fetch_tag_feed`
  - Requires `general_tag_id`; `tab` supports `hot`, `latest`, `image`, and
    `live`. The `live` option returns aggregation results only and does not
    fetch live streams.
  - `tag_type` defaults to `1` and `tag_source` defaults to `2`. Sound/music
    tags may use `tag_type=29` and `tag_source=3`, but the tool does not add
    music download capability.
- `tikhub_kuaishou_video_details`
  - GET `/api/v1/kuaishou/app/fetch_one_video`
  - Requires a numeric photoId or short eID in the string parameter `photo_id`.
  - For video search results, extract the `photoId` query value from
    `data.data.mixFeeds[].feed.share_info`. For example,
    `userId=3x4afefkzbi6r8a&photoId=3xus5bdgm6wmzyk` yields
    `3xus5bdgm6wmzyk`.
  - Do not substitute `streamManifest.videoId`, a stream comment `videoId`,
    `refer_photo_id`, or a media URL.
- `tikhub_kuaishou_video_details_by_url`
  - GET `/api/v1/kuaishou/app/fetch_one_video_by_url`
  - Accepts a post URL or complete share text in `share_text`.
- `tikhub_kuaishou_video_comments`
  - GET `/api/v1/kuaishou/app/fetch_video_comment`
  - Requires `photo_id`; its optional `pcursor` has no default in the live
    OpenAPI.
- `tikhub_kuaishou_comment_replies`
  - GET `/api/v1/kuaishou/app/fetch_video_sub_comments`
  - Requires `photo_id` and `root_comment_id`; `count` defaults to `8` and must
    be from `1` through `20`.
- `tikhub_kuaishou_user_profile`
  - GET `/api/v1/kuaishou/app/fetch_one_user_v2`
  - Accepts either a user eID or numeric userId.
- `tikhub_kuaishou_user_videos`
  - GET `/api/v1/kuaishou/app/fetch_user_post_v2`
  - Requires a digits-only numeric `user_id`; eIDs are rejected. `sort`
    supports `latest` and `hot` and defaults to `latest`.
- `tikhub_kuaishou_hot_board_categories`
  - GET `/api/v1/kuaishou/app/fetch_hot_board_categories`
  - Returns the `boardType` and `boardId` values used by board details.
- `tikhub_kuaishou_hot_board_details`
  - GET `/api/v1/kuaishou/app/fetch_hot_board_detail`
  - Uses integer `boardType` and `boardId`. The live OpenAPI declares
    `boardId` as an integer but supplies an invalid string default; the tool
    uses the type-safe numeric default `1` and does not coerce string input.

## Analysis Chains

Video search monitoring:

1. Call `tikhub_kuaishou_video_search` with a keyword.
2. Extract the `photoId` query value from each selected result's
   `data.data.mixFeeds[].feed.share_info`.
3. Pass that value unchanged to `tikhub_kuaishou_video_details`.
4. Pass the same `photo_id` to `tikhub_kuaishou_video_comments`.
5. Pass selected root comment IDs to `tikhub_kuaishou_comment_replies`.

Known share-link monitoring:

1. Pass a known post URL or complete share text to
   `tikhub_kuaishou_video_details_by_url`.
2. Read the post's `photo_id` from the response when available.
3. Pass the returned `photo_id` to `tikhub_kuaishou_video_comments`.
4. Pass selected root comment IDs to `tikhub_kuaishou_comment_replies`.

Topic monitoring:

1. Call `tikhub_kuaishou_tag_search`.
2. Pass a returned tag name or numeric ID to `tikhub_kuaishou_tag_feed`.
3. Pass a selected result's `photoId` to
   `tikhub_kuaishou_video_details`, then continue with the comment chain.

Account and competitor analysis:

1. Call `tikhub_kuaishou_user_search`.
2. Pass an eID or numeric userId to `tikhub_kuaishou_user_profile`.
3. Read the digits-only numeric userId from the profile response.
4. Pass that numeric ID as a string to `tikhub_kuaishou_user_videos`, using
   `latest` or `hot` sorting.
5. Pass selected post photoIds to `tikhub_kuaishou_video_details`, then fetch
   comments and replies as needed.

Hot-topic discovery:

1. Call `tikhub_kuaishou_hot_board_categories`.
2. Pass a returned integer `boardType` and `boardId` to
   `tikhub_kuaishou_hot_board_details`.
3. Use relevant hot terms with the video, user, or tag search tools.

## Identifier And Pagination Rules

`photo_id` may be a numeric ID or a short eID, but it is always passed as a
string. For video search results, use the `photoId` query value embedded in
`feed.share_info`; do not use stream IDs, `refer_photo_id`, or media URLs.
`root_comment_id`, user IDs, tag IDs, source photo IDs, and every
`pcursor` are also kept as strings. The plugin never converts these identifiers
to JavaScript numbers, preserving long-ID precision.

`tikhub_kuaishou_user_profile` accepts an eID or numeric userId, while
`tikhub_kuaishou_user_videos` only accepts a digits-only numeric userId. Resolve
an eID through the profile tool before requesting a user's posts.

Every `pcursor` is opaque. Leave it empty or omit it for the first page, then
pass the previous response value unchanged. Do not parse, decode, rewrite, or
synthesize cursors.

## Not Included

This release does not implement `Kuaishou-Web-API`, duplicate App search or
detail endpoints outside this 12-tool scope, image/live/music search, selected
feeds, favorites, shopping or brand boards, live information or replay, batch
video queries, share-link generation, playback URLs, media download or
playback, subtitles, ASR, summaries, sentiment analysis, lead scoring,
competitor scoring, persistence, or scheduled monitoring.
