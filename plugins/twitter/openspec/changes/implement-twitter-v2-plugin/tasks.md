## 1. 依赖与基础设施

- [ ] 1.1 在 `package.json` 中添加 `@xdevplatform/xdk` 依赖并安装
- [ ] 1.2 创建 `src/credentials/twitter-oauth.ts`，实现 OAuth 2.0 PKCE 凭证定义（client_id、client_secret、access_token、refresh_token、code_verifier、expires_at；使用 SDK 的 `generateCodeVerifier`/`generateCodeChallenge` 生成 PKCE；实现 oauth2_build_authorize_url、oauth2_get_token、oauth2_refresh_token）
- [ ] 1.3 创建 `src/lib/require-twitter.ts` 辅助函数，从工具参数中提取凭证并返回 SDK 的 `new Client({ accessToken })`，凭证缺失时抛出异常

## 2. 共享参数

- [ ] 2.1 创建 `src/tools/_shared/parameters.ts`，定义共享参数：twitterCredentialParam、tweetIdParam、userIdParam、usernameParam、maxResultsParam、paginationTokenParam、queryParam

## 3. 推文管理工具

- [ ] 3.1 创建 `src/tools/create-tweet.ts` — `client.posts.create()`，支持 text、reply_to_tweet_id、quote_tweet_id 参数
- [ ] 3.2 创建 `src/tools/delete-tweet.ts` — `client.posts.delete()`
- [ ] 3.3 创建 `src/tools/get-tweet.ts` — `client.posts.getById()`，附带 tweetFields 和 expansions
- [ ] 3.4 创建 `src/tools/search-tweets.ts` — `client.posts.searchRecent()`，支持 query 和分页
- [ ] 3.5 创建 `src/tools/get-user-tweets.ts` — `client.users.getPosts()`，支持分页

## 4. 用户管理工具

- [ ] 4.1 创建 `src/tools/get-me.ts` — `client.users.getMe()`，附带 userFields
- [ ] 4.2 创建 `src/tools/get-user.ts` — `client.users.getById()`，附带 userFields
- [ ] 4.3 创建 `src/tools/get-user-by-username.ts` — `client.users.getByUsername()`，附带 userFields
- [ ] 4.4 创建 `src/tools/get-followers.ts` — `client.users.getFollowers()`，支持分页
- [ ] 4.5 创建 `src/tools/get-following.ts` — `client.users.getFollowing()`，支持分页

## 5. 推文互动工具

- [ ] 5.1 创建 `src/tools/like-tweet.ts` — `client.users.likePost()`（需先获取当前用户）
- [ ] 5.2 创建 `src/tools/unlike-tweet.ts` — `client.users.unlikePost()`（需先获取当前用户）
- [ ] 5.3 创建 `src/tools/retweet.ts` — `client.users.repostPost()`（需先获取当前用户）
- [ ] 5.4 创建 `src/tools/undo-retweet.ts` — `client.users.unrepostPost()`（需先获取当前用户）

## 6. 国际化与插件注册

- [ ] 6.1 更新 `src/i18n/en-US/index.ts`，添加插件、凭证、工具和参数的所有翻译键
- [ ] 6.2 更新 `src/i18n/zh-Hans/index.ts`，添加中文翻译
- [ ] 6.3 更新 `src/index.ts`，导入凭证和所有工具，移除 demo 工具，注册所有组件到插件

## 7. 测试

- [ ] 7.1 更新 `test/index.test.ts`，编写单元测试：插件初始化、凭证定义、工具参数验证、使用 mock SDK Client 的工具调用
- [ ] 7.2 创建 `test/e2e.twitter.test.ts`，编写可跳过的 e2e 测试用于真实 API 调用（通过 TWITTER_E2E=1 标志控制）
