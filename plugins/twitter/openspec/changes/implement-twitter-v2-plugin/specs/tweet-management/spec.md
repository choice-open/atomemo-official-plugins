## 新增需求

### 需求：创建推文工具
插件必须提供 `twitter-create-tweet` 工具，通过 `client.posts.create()` 创建新推文。

#### 场景：创建纯文本推文
- **当** 使用 `text` 参数调用工具时
- **则** 必须调用 `client.posts.create({ text })` 并返回包含 `id` 和 `text` 的已创建推文数据

#### 场景：创建回复推文
- **当** 使用 `text` 和 `reply_to_tweet_id` 参数调用工具时
- **则** 必须调用 `client.posts.create({ text, reply: { inReplyToTweetId } })` 并返回已创建的推文数据

#### 场景：创建引用推文
- **当** 使用 `text` 和 `quote_tweet_id` 参数调用工具时
- **则** 必须调用 `client.posts.create({ text, quoteTweetId })` 并返回已创建的推文数据

### 需求：删除推文工具
插件必须提供 `twitter-delete-tweet` 工具，通过 `client.posts.delete()` 删除推文。

#### 场景：删除推文
- **当** 使用 `tweet_id` 调用工具时
- **则** 必须调用 `client.posts.delete(tweetId)` 并返回删除结果

### 需求：获取推文工具
插件必须提供 `twitter-get-tweet` 工具，通过 `client.posts.getById()` 获取单条推文。

#### 场景：获取推文及扩展信息
- **当** 使用 `tweet_id` 调用工具时
- **则** 必须调用 `client.posts.getById(tweetId, { tweetFields: ["created_at", "public_metrics", "author_id", "conversation_id"], expansions: ["author_id"], userFields: ["username", "name", "profile_image_url"] })` 并返回包含作者信息的推文数据

### 需求：搜索推文工具
插件必须提供 `twitter-search-tweets` 工具，通过 `client.posts.searchRecent()` 搜索近期推文。

#### 场景：使用查询搜索推文
- **当** 使用 `query` 字符串调用工具时
- **则** 必须调用 `client.posts.searchRecent(query, { tweetFields, expansions, maxResults })` 并返回匹配的推文

#### 场景：分页搜索结果
- **当** 使用 `query` 和 `next_token` 调用工具时
- **则** 必须在请求选项中包含 `paginationToken` 并返回下一页结果

### 需求：获取用户推文工具
插件必须提供 `twitter-get-user-tweets` 工具，通过 `client.users.getPosts()` 获取用户的推文。

#### 场景：获取用户时间线
- **当** 使用 `user_id` 调用工具时
- **则** 必须调用 `client.users.getPosts(userId, { tweetFields, expansions })` 并返回用户的推文

#### 场景：分页时间线
- **当** 使用 `user_id`、`max_results` 和 `pagination_token` 调用工具时
- **则** 必须包含分页参数并返回请求的推文页
