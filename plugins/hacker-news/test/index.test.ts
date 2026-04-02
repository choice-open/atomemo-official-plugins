import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { getHackerNewsArticleTool } from "../src/tools/get-hacker-news-article"
import { getHackerNewsUserTool } from "../src/tools/get-hacker-news-user"
import { searchHackerNewsTool } from "../src/tools/search-hacker-news"

vi.mock("../src/tools/skills/search-hacker-news.md", () => ({
  default: "",
}))

vi.mock("../src/tools/skills/get-hacker-news-article.md", () => ({
  default: "",
}))

vi.mock("../src/tools/skills/get-hacker-news-user.md", () => ({
  default: "",
}))

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}))

vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {} }),
}))

describe("hacker-news plugin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it("creates a plugin instance with the expected manifest fields", async () => {
    const plugin = await createPlugin({
      name: "hacker-news",
      display_name: { en_US: "Hacker News" },
      description: { en_US: "Consume the Hacker News API powered by Algolia" },
      icon: "📰",
      lang: "typescript",
      version: "0.1.0",
      repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/hacker-news",
      locales: ["en-US"],
      transporterOptions: {},
    })

    expect(plugin).toBeDefined()
    expect(plugin.addTool).toBeTypeOf("function")
    expect(plugin.run).toBeTypeOf("function")
  })

  it("registers the Hacker News tools on plugin startup", async () => {
    const addTool = vi.fn()
    const addModel = vi.fn()
    const addCredential = vi.fn()
    const run = vi.fn()
    const createPluginMock = vi.mocked(createPlugin)

    createPluginMock.mockResolvedValueOnce({
      addTool,
      addModel,
      addCredential,
      run,
    } as unknown as Awaited<ReturnType<typeof createPlugin>>)

    vi.resetModules()
    await import("../src/index")

    expect(createPluginMock).toHaveBeenCalled()
    expect(addTool).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: searchHackerNewsTool.name,
      }),
    )
    expect(addTool).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: getHackerNewsArticleTool.name,
      }),
    )
    expect(addTool).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: getHackerNewsUserTool.name,
      }),
    )
    expect(run).toHaveBeenCalled()
  })
})

describe("searchHackerNewsTool", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("exposes the expected top-level metadata", () => {
    expect(searchHackerNewsTool).toEqual(
      expect.objectContaining({
        name: "search-hacker-news",
        icon: "📰",
        parameters: expect.arrayContaining([
          expect.objectContaining({
            name: "keyword",
            type: "string",
          }),
        ]),
      }),
    )
  })

  it("returns normalized search results", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        nbHits: 1,
        hits: [
          {
            objectID: "1",
            title: "Test story",
            url: "https://example.com/story",
            author: "pg",
            created_at: "2024-01-01T00:00:00.000Z",
            points: 42,
            num_comments: 8,
            story_text: "Story body",
            _tags: ["story"],
          },
        ],
      }),
    } as Response)

    const result = await searchHackerNewsTool.invoke({
      args: {
        parameters: { keyword: "test", results_per_page: 5, tags: ["story"] },
      },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      "http://hn.algolia.com/api/v1/search?query=test&tags=story&page=0&hitsPerPage=5",
      { method: "GET" },
    )
    expect(result).toEqual({
      query: "test",
      tags: ["story"],
      total: 1,
      count: 1,
      items: [
        {
          id: "1",
          type: "story",
          title: "Test story",
          url: "https://example.com/story",
          author: "pg",
          created_at: "2024-01-01T00:00:00.000Z",
          points: 42,
          comment_count: 8,
          text: "Story body",
        },
      ],
    })
  })

  it("maps author and story_id into Algolia tag syntax", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        nbHits: 0,
        hits: [],
      }),
    } as Response)

    const result = await searchHackerNewsTool.invoke({
      args: {
        parameters: {
          keyword: "test",
          tags: ["story", "ask_hn"],
          author: "  pg  ",
          story_id: 8863,
        },
      },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "http://hn.algolia.com/api/v1/search?query=test&tags=story%2Cask_hn%2Cauthor_pg%2Cstory_8863&page=0&hitsPerPage=100",
      { method: "GET" },
    )
    expect(result).toEqual({
      query: "test",
      tags: ["story", "ask_hn"],
      total: 0,
      count: 0,
      items: [],
    })
  })

  it("omits blank author and invalid story_id filters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        nbHits: 0,
        hits: [],
      }),
    } as Response)

    await searchHackerNewsTool.invoke({
      args: {
        parameters: {
          keyword: "test",
          author: "   ",
          story_id: 0,
        },
      },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "http://hn.algolia.com/api/v1/search?query=test&page=0&hitsPerPage=100",
      { method: "GET" },
    )
  })

  it("supports search_by_date, page, and numeric_filters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        nbHits: 0,
        hits: [],
      }),
    } as Response)

    const result = await searchHackerNewsTool.invoke({
      args: {
        parameters: {
          keyword: "launch hn",
          search_by_date: true,
          page: 2,
          numeric_filters: "created_at_i>1700000000,points>100",
        },
      },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "http://hn.algolia.com/api/v1/search_by_date?query=launch+hn&numericFilters=created_at_i%3E1700000000%2Cpoints%3E100&page=2&hitsPerPage=100",
      { method: "GET" },
    )
    expect(result).toEqual({
      query: "launch hn",
      tags: [],
      total: 0,
      count: 0,
      items: [],
    })
  })
})

describe("getHackerNewsArticleTool", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("exposes the expected top-level metadata", () => {
    expect(getHackerNewsArticleTool).toEqual(
      expect.objectContaining({
        name: "get-hacker-news-article",
        icon: "📰",
        parameters: expect.arrayContaining([
          expect.objectContaining({
            name: "article_id",
            type: "string",
            required: true,
          }),
          expect.objectContaining({
            name: "include_comments",
            type: "boolean",
          }),
        ]),
      }),
    )
  })

  it("returns a normalized article without comments by default", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123,
        type: "story",
        title: "Test story",
        url: "https://example.com/story",
        author: "pg",
        created_at: "2024-01-01T00:00:00.000Z",
        points: 42,
        text: "Story body",
        children: [{ id: 200 }],
      }),
    } as Response)

    const result = await getHackerNewsArticleTool.invoke({
      args: { parameters: { article_id: "123" } },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(result).toEqual({
      item: {
        id: 123,
        type: "story",
        title: "Test story",
        url: "https://example.com/story",
        author: "pg",
        created_at: "2024-01-01T00:00:00.000Z",
        points: 42,
        text: "Story body",
        parent_id: null,
        children_count: 1,
      },
    })
  })

  it("returns a normalized article with comment tree when requested", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123,
        type: "story",
        title: "Test story",
        url: "https://example.com/story",
        author: "pg",
        created_at: "2024-01-01T00:00:00.000Z",
        points: 42,
        text: "Story body",
        children: [
          {
            id: 200,
            author: "sama",
            text: "First comment",
            created_at: "2024-01-01T01:00:00.000Z",
            parent_id: 123,
            children: [
              {
                id: 201,
                author: "dang",
                text: "Nested comment",
                created_at: "2024-01-01T02:00:00.000Z",
                parent_id: 200,
                children: [],
              },
            ],
          },
        ],
      }),
    } as Response)

    const result = await getHackerNewsArticleTool.invoke({
      args: { parameters: { article_id: "123", include_comments: true } },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(result).toEqual({
      item: {
        id: 123,
        type: "story",
        title: "Test story",
        url: "https://example.com/story",
        author: "pg",
        created_at: "2024-01-01T00:00:00.000Z",
        points: 42,
        text: "Story body",
        parent_id: null,
        children_count: 1,
      },
      comments: [
        {
          id: 200,
          author: "sama",
          text: "First comment",
          created_at: "2024-01-01T01:00:00.000Z",
          parent_id: 123,
          children_count: 1,
          children: [
            {
              id: 201,
              author: "dang",
              text: "Nested comment",
              created_at: "2024-01-01T02:00:00.000Z",
              parent_id: 200,
              children_count: 0,
              children: [],
            },
          ],
        },
      ],
    })
  })

  it("preserves non-story item types", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 200,
        type: "comment",
        author: "pg",
        text: "A comment",
        created_at: "2024-01-01T01:00:00.000Z",
        parent_id: 123,
        children: [],
      }),
    } as Response)

    const result = await getHackerNewsArticleTool.invoke({
      args: { parameters: { article_id: "200" } },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(result).toEqual({
      item: {
        id: 200,
        type: "comment",
        title: null,
        url: null,
        author: "pg",
        created_at: "2024-01-01T01:00:00.000Z",
        points: null,
        text: "A comment",
        parent_id: 123,
        children_count: 0,
      },
    })
  })
})

describe("getHackerNewsUserTool", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("exposes the expected top-level metadata", () => {
    expect(getHackerNewsUserTool).toEqual(
      expect.objectContaining({
        name: "get-hacker-news-user",
        icon: "📰",
        parameters: expect.arrayContaining([
          expect.objectContaining({
            name: "username",
            type: "string",
            required: true,
          }),
        ]),
      }),
    )
  })

  it("returns a normalized user profile", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        username: "pg",
        karma: 12345,
        about: "Founder",
      }),
    } as Response)

    const result = await getHackerNewsUserTool.invoke({
      args: { parameters: { username: "pg" } },
      context: {
        files: {
          attachRemoteUrl: vi.fn(),
          download: vi.fn(),
          upload: vi.fn(),
          parseFileRef: vi.fn(),
        },
      },
    })

    expect(result).toEqual({
      user: {
        username: "pg",
        karma: 12345,
        about: "Founder",
      },
    })
  })
})
