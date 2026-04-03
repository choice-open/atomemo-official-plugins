## 新增需求

### 需求：点赞推文工具
插件必须提供 `twitter-like-tweet` 工具，通过 `client.users.likePost()` 点赞推文。

#### 场景：点赞推文
- **当** 使用 `tweet_id` 调用工具时
- **则** 必须先通过 `client.users.getMe()` 获取已认证用户的 ID，然后调用 `client.users.likePost(userId, { body: { tweetId } })` 并返回结果

### 需求：取消点赞推文工具
插件必须提供 `twitter-unlike-tweet` 工具，通过 `client.users.unlikePost()` 取消点赞推文。

#### 场景：取消点赞推文
- **当** 使用 `tweet_id` 调用工具时
- **则** 必须先通过 `client.users.getMe()` 获取已认证用户的 ID，然后调用 `client.users.unlikePost(userId, tweetId)` 并返回结果

### 需求：转推工具
插件必须提供 `twitter-retweet` 工具，通过 `client.users.repostPost()` 转推。

#### 场景：转推
- **当** 使用 `tweet_id` 调用工具时
- **则** 必须先通过 `client.users.getMe()` 获取已认证用户的 ID，然后调用 `client.users.repostPost(userId, { body: { tweetId } })` 并返回结果

### 需求：取消转推工具
插件必须提供 `twitter-undo-retweet` 工具，通过 `client.users.unrepostPost()` 取消转推。

#### 场景：取消转推
- **当** 使用 `tweet_id` 调用工具时
- **则** 必须先通过 `client.users.getMe()` 获取已认证用户的 ID，然后调用 `client.users.unrepostPost(userId, tweetId)` 并返回结果
