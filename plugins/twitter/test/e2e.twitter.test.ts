import { describe, expect, it } from "vitest"

const SKIP_E2E = !process.env.TWITTER_E2E

// These tests require real Twitter API credentials.
// Set TWITTER_E2E=1 and provide TWITTER_ACCESS_TOKEN to run them.
describe.skipIf(SKIP_E2E)("twitter e2e", () => {
  const { Client } =
    require("@xdevplatform/xdk") as typeof import("@xdevplatform/xdk")

  function getClient() {
    const accessToken = process.env.TWITTER_ACCESS_TOKEN
    if (!accessToken)
      throw new Error("TWITTER_ACCESS_TOKEN is required for e2e tests")
    return new Client({ accessToken })
  }

  it("should get authenticated user profile", async () => {
    const client = getClient()
    const res = await client.users.getMe({
      userFields: ["created_at", "description", "public_metrics"],
    })
    expect(res.data).toBeDefined()
    expect(res.data?.id).toBeDefined()
    expect(res.data?.username).toBeDefined()
  })

  it("should search recent tweets", async () => {
    const client = getClient()
    const res = await client.posts.searchRecent("twitter", {
      maxResults: 5,
      tweetFields: ["created_at", "author_id"],
    })
    expect(res.data).toBeDefined()
  })

  it("should get user by username", async () => {
    const client = getClient()
    const res = await client.users.getByUsername("X", {
      userFields: ["created_at", "public_metrics"],
    })
    expect(res.data).toBeDefined()
    expect(res.data?.username?.toLowerCase()).toBe("x")
  })

  it("should create and delete a tweet", async () => {
    const client = getClient()
    const text = `e2e test tweet ${Date.now()}`
    const created = await client.posts.create({ text })
    expect(created.data?.id).toBeDefined()

    const deleted = await client.posts.delete(created.data!.id!)
    expect(deleted.data?.deleted).toBe(true)
  })
})
