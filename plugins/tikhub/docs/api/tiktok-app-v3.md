# TikHub TikTok App V3 API

## 参考文档

- [Swagger UI](https://api.tikhub.io/#/TikTok-App-V3-API)
- [Apifox UI](https://docs.tikhub.io)
- [TikHub 用户后台](https://user.tikhub.io)

## API 列表

| 序号 | API 名称 | Method | Path | 备注 |
| --- | --- | --- | --- | --- |
| 1 | 获取单个作品数据 V3(支持国家参数)/Get single video data V3 (support country parameter) | `GET` | `/api/v1/tiktok/app/v3/fetch_one_video_v3` | 支持 `region`，默认 `US` |
| 2 | 批量获取视频信息 V2/Batch Get Video Information V2 | `POST` | `/api/v1/tiktok/app/v3/fetch_multi_video_v2` | 请求体为视频 ID 字符串数组 |
| 3 | 根据分享链接获取单个作品数据/Get single video data by sharing link | `GET` | `/api/v1/tiktok/app/v3/fetch_one_video_by_share_url_v2` | V2 分享链接接口 |
| 4 | 获取用户主页作品数据 V3/Get user homepage video data V3 | `GET` | `/api/v1/tiktok/app/v3/fetch_user_post_videos_v3` | 精简数据，更快速 |
| 5 | 获取单个视频评论数据/Get single video comments data | `GET` | `/api/v1/tiktok/app/v3/fetch_video_comments` | 支持分页 |
| 6 | 获取指定视频的评论回复数据/Get comment replies data of specified video | `GET` | `/api/v1/tiktok/app/v3/fetch_video_comment_replies` | 支持分页 |
| 7 | 获取指定关键词的综合搜索结果/Get comprehensive search results of specified keywords | `GET` | `/api/v1/tiktok/app/v3/fetch_general_search_result` | 支持排序和发布时间筛选 |
| 8 | 获取指定关键词的视频搜索结果/Get video search results of specified keywords | `GET` | `/api/v1/tiktok/app/v3/fetch_video_search_result` | 支持 `region`，默认 `US` |
| 9 | 获取指定关键词的用户搜索结果/Get user search results of specified keywords | `GET` | `/api/v1/tiktok/app/v3/fetch_user_search_result` | 支持用户筛选参数 |
| 10 | 获取指定关键词的音乐搜索结果/Get music search results of specified keywords | `GET` | `/api/v1/tiktok/app/v3/fetch_music_search_result` | 支持 `filter_by`、`sort_type` 和 `region` |
| 11 | 获取指定关键词的话题搜索结果/Get hashtag search results of specified keywords | `GET` | `/api/v1/tiktok/app/v3/fetch_hashtag_search_result` | 支持分页 |

> 接口总数: 11

## 参数说明

### 公共参数

所有接口通过 `tikhub-api-key` credential 自动注入 `Authorization: Bearer <api_key>` 请求头，无需手动传递。

### 接口特定参数

| Tool | 参数 |
| --- | --- |
| `tikhub_tiktok_fetch_one_video_v3` | `aweme_id` 必填；`region` 可选，默认 `US` |
| `tikhub_tiktok_fetch_multi_video_v2` | `aweme_ids` 必填，多个视频 ID 用逗号分隔，工具会转换为 JSON 字符串数组 |
| `tikhub_tiktok_fetch_one_video_by_share_url_v2` | `share_url` 必填 |
| `tikhub_tiktok_fetch_user_post_videos_v3` | `sec_user_id` 与 `unique_id` 至少填写一个；`max_cursor` 默认 `0`；`count` 默认 `20`；`sort_type` 默认 `0` |
| `tikhub_tiktok_fetch_video_comments` | `aweme_id` 必填；`cursor` 默认 `0`；`count` 默认 `20` |
| `tikhub_tiktok_fetch_video_comment_replies` | `item_id`、`comment_id` 必填；`cursor` 默认 `0`；`count` 默认 `20` |
| `tikhub_tiktok_fetch_general_search_result` | `keyword` 必填；`offset` 默认 `0`；`count` 默认 `20`；`sort_type` 默认 `0`；`publish_time` 默认 `0` |
| `tikhub_tiktok_fetch_video_search_result` | `keyword` 必填；`offset` 默认 `0`；`count` 默认 `20`；`sort_type` 默认 `0`；`publish_time` 默认 `0`；`region` 默认 `US` |
| `tikhub_tiktok_fetch_user_search_result` | `keyword` 必填；`offset` 默认 `0`；`count` 默认 `20`；`user_search_follower_count`、`user_search_profile_type`、`user_search_other_pref` 可选 |
| `tikhub_tiktok_fetch_music_search_result` | `keyword` 必填；`offset` 默认 `0`；`count` 默认 `20`；`filter_by` 默认 `0`；`sort_type` 默认 `0`；`region` 默认 `US` |
| `tikhub_tiktok_fetch_hashtag_search_result` | `keyword` 必填；`offset` 默认 `0`；`count` 默认 `20` |

## 请求示例

```json
{
  "credential_id": "selected TikHub credential",
  "keyword": "food",
  "offset": 0,
  "count": 20,
  "region": "US"
}
```

## 响应示例

```json
{
  "code": 200,
  "data": {}
}
```
