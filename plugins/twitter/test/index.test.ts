import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
    run: vi.fn(),
  }),
}))

// Mock i18n
vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {} }),
}))

// Mock XDK
const mockPostsCreate = vi.fn()
const mockPostsDelete = vi.fn()
const mockPostsGetById = vi.fn()
const mockPostsSearchRecent = vi.fn()
const mockUsersGetMe = vi.fn()
const mockUsersGetById = vi.fn()
const mockUsersGetByUsername = vi.fn()
const mockUsersGetPosts = vi.fn()
const mockUsersGetFollowers = vi.fn()
const mockUsersGetFollowing = vi.fn()
const mockUsersLikePost = vi.fn()
const mockUsersUnlikePost = vi.fn()
const mockUsersRepostPost = vi.fn()
const mockUsersUnrepostPost = vi.fn()

vi.mock("@xdevplatform/xdk", () => {
  const MockClient = function (this: any) {
    this.posts = {
      create: mockPostsCreate,
      delete: mockPostsDelete,
      getById: mockPostsGetById,
      searchRecent: mockPostsSearchRecent,
    }
    this.users = {
      getMe: mockUsersGetMe,
      getById: mockUsersGetById,
      getByUsername: mockUsersGetByUsername,
      getPosts: mockUsersGetPosts,
      getFollowers: mockUsersGetFollowers,
      getFollowing: mockUsersGetFollowing,
      likePost: mockUsersLikePost,
      unlikePost: mockUsersUnlikePost,
      repostPost: mockUsersRepostPost,
      unrepostPost: mockUsersUnrepostPost,
    }
  }
  const MockOAuth2 = function (this: any) {
    this.setPkceParameters = vi.fn()
    this.getAuthorizationUrl = vi.fn().mockResolvedValue("https://twitter.com/i/oauth2/authorize?mock=true")
    this.exchangeCode = vi.fn().mockResolvedValue({ access_token: "test", refresh_token: "test", expires_at: 9999999999 })
    this.refreshAccessToken = vi.fn().mockResolvedValue({ access_token: "test", refresh_token: "test", expires_at: 9999999999 })
  }
  return {
    Client: MockClient,
    OAuth2: MockOAuth2,
    generateCodeVerifier: vi.fn().mockReturnValue("test-code-verifier"),
    generateCodeChallenge: vi.fn().mockResolvedValue("test-code-challenge"),
  }
})

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { twitterOAuthCredential } from "../src/credentials/twitter-oauth"
import { createTweetTool } from "../src/tools/create-tweet"
import { deleteTweetTool } from "../src/tools/delete-tweet"
import { getFollowersTool } from "../src/tools/get-followers"
import { getFollowingTool } from "../src/tools/get-following"
import { getMeTool } from "../src/tools/get-me"
import { getTweetTool } from "../src/tools/get-tweet"
import { getUserTool } from "../src/tools/get-user"
import { getUserByUsernameTool } from "../src/tools/get-user-by-username"
import { getUserTweetsTool } from "../src/tools/get-user-tweets"
import { likeTweetTool } from "../src/tools/like-tweet"
import { retweetTool } from "../src/tools/retweet"
import { searchTweetsTool } from "../src/tools/search-tweets"
import { undoRetweetTool } from "../src/tools/undo-retweet"
import { unlikeTweetTool } from "../src/tools/unlike-tweet"

const mockCredentials = {
  "twitter-oauth": {
    access_token: "test-token",
    client_id: "cid",
    client_secret: "cs",
  },
}

describe("twitter plugin", () => {
  describe("plugin initialization", () => {
    it("should create plugin and register all tools and credential", async () => {
      const addTool = vi.fn()
      const addCredential = vi.fn()
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({ addTool, addCredential, run })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(twitterOAuthCredential)
      expect(addTool).toHaveBeenCalledTimes(14)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("credential definition", () => {
    it("should have correct name and oauth2 flag", () => {
      expect(twitterOAuthCredential.name).toBe("twitter-oauth")
      expect(twitterOAuthCredential.oauth2).toBe(true)
    })

    it("should define required parameters", () => {
      const paramNames = twitterOAuthCredential.parameters.map((p) => p.name)
      expect(paramNames).toContain("client_id")
      expect(paramNames).toContain("client_secret")
      expect(paramNames).toContain("access_token")
      expect(paramNames).toContain("refresh_token")
      expect(paramNames).toContain("expires_at")
    })

    it("should hide internal oauth fields", () => {
      const hiddenFields = [
        "access_token",
        "refresh_token",
        "expires_at",
      ]
      for (const fieldName of hiddenFields) {
        const param = twitterOAuthCredential.parameters.find(
          (p) => p.name === fieldName,
        )
        expect(param?.ui?.display_none).toBe(true)
      }
    })
  })

  describe("tool parameter validation", () => {
    it("create-tweet should have twitter_credential and text parameters", () => {
      const paramNames = createTweetTool.parameters.map((p: any) => p.name)
      expect(paramNames).toContain("twitter_credential")
      expect(paramNames).toContain("text")
      expect(paramNames).toContain("reply_to_tweet_id")
      expect(paramNames).toContain("quote_tweet_id")
    })

    it("delete-tweet should have twitter_credential and tweet_id", () => {
      const paramNames = deleteTweetTool.parameters.map((p: any) => p.name)
      expect(paramNames).toContain("twitter_credential")
      expect(paramNames).toContain("tweet_id")
    })

    it("search-tweets should have query and pagination params", () => {
      const paramNames = searchTweetsTool.parameters.map((p: any) => p.name)
      expect(paramNames).toContain("query")
      expect(paramNames).toContain("max_results")
      expect(paramNames).toContain("pagination_token")
    })

    it("get-followers should have user_id and pagination params", () => {
      const paramNames = getFollowersTool.parameters.map((p: any) => p.name)
      expect(paramNames).toContain("user_id")
      expect(paramNames).toContain("max_results")
      expect(paramNames).toContain("pagination_token")
    })
  })

  describe("tool invocations with mock SDK", () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it("create-tweet should call client.posts.create()", async () => {
      mockPostsCreate.mockResolvedValue({ data: { id: "123", text: "hello" } })

      const result = await createTweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", text: "hello" },
        },
      })

      expect(mockPostsCreate).toHaveBeenCalledWith({ text: "hello" })
      expect(result).toEqual({ data: { id: "123", text: "hello" } })
    })

    it("create-tweet should support reply", async () => {
      mockPostsCreate.mockResolvedValue({ data: { id: "124", text: "reply" } })

      await createTweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: {
            twitter_credential: "twitter-oauth",
            text: "reply",
            reply_to_tweet_id: "100",
          },
        },
      })

      expect(mockPostsCreate).toHaveBeenCalledWith({
        text: "reply",
        reply: { inReplyToTweetId: "100" },
      })
    })

    it("delete-tweet should call client.posts.delete()", async () => {
      mockPostsDelete.mockResolvedValue({ data: { deleted: true } })

      const result = await deleteTweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", tweet_id: "123" },
        },
      })

      expect(mockPostsDelete).toHaveBeenCalledWith("123")
      expect(result).toEqual({ data: { deleted: true } })
    })

    it("get-tweet should call client.posts.getById() with fields", async () => {
      mockPostsGetById.mockResolvedValue({ data: { id: "123" }, includes: {} })

      const result = await getTweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", tweet_id: "123" },
        },
      })

      expect(mockPostsGetById).toHaveBeenCalledWith("123", {
        tweetFields: [
          "created_at",
          "public_metrics",
          "author_id",
          "conversation_id",
        ],
        expansions: ["author_id"],
        userFields: ["username", "name", "profile_image_url"],
      })
      expect(result).toEqual({ data: { id: "123" }, includes: {} })
    })

    it("search-tweets should call client.posts.searchRecent()", async () => {
      mockPostsSearchRecent.mockResolvedValue({
        data: [],
        includes: {},
        meta: {},
      })

      await searchTweetsTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: {
            twitter_credential: "twitter-oauth",
            query: "test",
            max_results: 10,
          },
        },
      })

      expect(mockPostsSearchRecent).toHaveBeenCalledWith(
        "test",
        expect.objectContaining({
          maxResults: 10,
        }),
      )
    })

    it("get-me should call client.users.getMe()", async () => {
      mockUsersGetMe.mockResolvedValue({ data: { id: "1", username: "test" } })

      const result = await getMeTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth" },
        },
      })

      expect(mockUsersGetMe).toHaveBeenCalledWith({
        userFields: [
          "created_at",
          "description",
          "public_metrics",
          "profile_image_url",
          "verified",
        ],
      })
      expect(result).toEqual({ data: { id: "1", username: "test" } })
    })

    it("get-user should call client.users.getById()", async () => {
      mockUsersGetById.mockResolvedValue({ data: { id: "1" } })

      await getUserTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", user_id: "1" },
        },
      })

      expect(mockUsersGetById).toHaveBeenCalledWith("1", expect.any(Object))
    })

    it("get-user-by-username should call client.users.getByUsername()", async () => {
      mockUsersGetByUsername.mockResolvedValue({ data: { id: "1" } })

      await getUserByUsernameTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", username: "test" },
        },
      })

      expect(mockUsersGetByUsername).toHaveBeenCalledWith(
        "test",
        expect.any(Object),
      )
    })

    it("like-tweet should get current user then call likePost()", async () => {
      mockUsersGetMe.mockResolvedValue({ data: { id: "me-123" } })
      mockUsersLikePost.mockResolvedValue({ data: { liked: true } })

      const result = await likeTweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", tweet_id: "456" },
        },
      })

      expect(mockUsersGetMe).toHaveBeenCalled()
      expect(mockUsersLikePost).toHaveBeenCalledWith("me-123", {
        body: { tweetId: "456" },
      })
      expect(result).toEqual({ data: { liked: true } })
    })

    it("unlike-tweet should get current user then call unlikePost()", async () => {
      mockUsersGetMe.mockResolvedValue({ data: { id: "me-123" } })
      mockUsersUnlikePost.mockResolvedValue({ data: { liked: false } })

      await unlikeTweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", tweet_id: "456" },
        },
      })

      expect(mockUsersUnlikePost).toHaveBeenCalledWith("me-123", "456")
    })

    it("retweet should get current user then call repostPost()", async () => {
      mockUsersGetMe.mockResolvedValue({ data: { id: "me-123" } })
      mockUsersRepostPost.mockResolvedValue({ data: { retweeted: true } })

      await retweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", tweet_id: "456" },
        },
      })

      expect(mockUsersRepostPost).toHaveBeenCalledWith("me-123", {
        body: { tweetId: "456" },
      })
    })

    it("undo-retweet should get current user then call unrepostPost()", async () => {
      mockUsersGetMe.mockResolvedValue({ data: { id: "me-123" } })
      mockUsersUnrepostPost.mockResolvedValue({ data: { retweeted: false } })

      await undoRetweetTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", tweet_id: "456" },
        },
      })

      expect(mockUsersUnrepostPost).toHaveBeenCalledWith("me-123", "456")
    })

    it("get-user-tweets should call client.users.getPosts()", async () => {
      mockUsersGetPosts.mockResolvedValue({ data: [], includes: {}, meta: {} })

      await getUserTweetsTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: {
            twitter_credential: "twitter-oauth",
            user_id: "1",
            max_results: 5,
          },
        },
      })

      expect(mockUsersGetPosts).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          maxResults: 5,
        }),
      )
    })

    it("get-followers should call client.users.getFollowers()", async () => {
      mockUsersGetFollowers.mockResolvedValue({ data: [], meta: {} })

      await getFollowersTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", user_id: "1" },
        },
      })

      expect(mockUsersGetFollowers).toHaveBeenCalledWith(
        "1",
        expect.any(Object),
      )
    })

    it("get-following should call client.users.getFollowing()", async () => {
      mockUsersGetFollowing.mockResolvedValue({ data: [], meta: {} })

      await getFollowingTool.invoke({
        args: {
          credentials: mockCredentials,
          parameters: { twitter_credential: "twitter-oauth", user_id: "1" },
        },
      })

      expect(mockUsersGetFollowing).toHaveBeenCalledWith(
        "1",
        expect.any(Object),
      )
    })
  })
})
