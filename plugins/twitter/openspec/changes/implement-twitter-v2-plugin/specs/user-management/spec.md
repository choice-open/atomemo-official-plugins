## 新增需求

### 需求：获取当前用户工具
插件必须提供 `twitter-get-me` 工具，通过 `client.users.getMe()` 获取已认证用户的个人资料。

#### 场景：获取自己的个人资料
- **当** 使用有效凭证调用工具时
- **则** 必须调用 `client.users.getMe({ userFields: ["created_at", "description", "public_metrics", "profile_image_url", "verified"] })` 并返回用户数据

### 需求：通过用户名获取用户工具
插件必须提供 `twitter-get-user-by-username` 工具，通过 `client.users.getByUsername()` 获取用户资料。

#### 场景：通过用户名获取用户
- **当** 使用 `username` 调用工具时
- **则** 必须调用 `client.users.getByUsername(username, { userFields })` 并返回用户数据

### 需求：通过 ID 获取用户工具
插件必须提供 `twitter-get-user` 工具，通过 `client.users.getById()` 获取用户资料。

#### 场景：通过 ID 获取用户
- **当** 使用 `user_id` 调用工具时
- **则** 必须调用 `client.users.getById(userId, { userFields })` 并返回用户数据

### 需求：获取关注者工具
插件必须提供 `twitter-get-followers` 工具，通过 `client.users.getFollowers()` 列出用户的关注者。

#### 场景：获取关注者列表
- **当** 使用 `user_id` 调用工具时
- **则** 必须调用 `client.users.getFollowers(userId, { userFields, maxResults })` 并返回关注者列表

#### 场景：分页关注者
- **当** 使用 `user_id` 和 `pagination_token` 调用工具时
- **则** 必须包含分页 token 并返回下一页关注者

### 需求：获取正在关注工具
插件必须提供 `twitter-get-following` 工具，通过 `client.users.getFollowing()` 列出用户正在关注的人。

#### 场景：获取正在关注列表
- **当** 使用 `user_id` 调用工具时
- **则** 必须调用 `client.users.getFollowing(userId, { userFields, maxResults })` 并返回正在关注列表

#### 场景：分页正在关注
- **当** 使用 `user_id` 和 `pagination_token` 调用工具时
- **则** 必须包含分页 token 并返回下一页正在关注
