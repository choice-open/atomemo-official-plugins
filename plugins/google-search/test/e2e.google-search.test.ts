/**
 * E2E: 调用真实 Google Custom Search JSON API，覆盖所有已知参数。
 * 需配置 GOOGLE_SEARCH_API_KEY 和 GOOGLE_SEARCH_ENGINE_ID 环境变量。
 * 未配置时测试将自动跳过。
 *
 * 获取凭证：
 * 1. API Key: Google Cloud Console 启用 Custom Search API 后创建
 * 2. Search Engine ID: https://programmablesearchengine.google.com 创建可编程搜索引擎
 */
import "dotenv/config"
import { describe, expect, it } from "vitest"

import { googleSearchTool } from "../src/tools/google-search"

const API_KEY = process.env.GOOGLE_SEARCH_API_KEY
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID
const CRED_ID = "e2e-cred"

const hasRealEnv =
  typeof API_KEY === "string" &&
  API_KEY.length > 0 &&
  typeof SEARCH_ENGINE_ID === "string" &&
  SEARCH_ENGINE_ID.length > 0

const maybeIt = hasRealEnv ? it : it.skip

function credentials(): Record<
  string,
  { api_key: string; search_engine_id: string }
> {
  if (!API_KEY || !SEARCH_ENGINE_ID) {
    throw new Error("E2E credentials not configured")
  }
  return {
    [CRED_ID]: { api_key: API_KEY, search_engine_id: SEARCH_ENGINE_ID },
  }
}

type SearchResult = {
  title: string
  link: string
  snippet: string
  displayLink: string
}

function assertResultStructure(results: SearchResult[], maxLen: number) {
  expect(results.length).toBeLessThanOrEqual(maxLen)
  for (const item of results) {
    expect(item).toMatchObject({
      title: expect.any(String),
      link: expect.any(String),
      snippet: expect.any(String),
      displayLink: expect.any(String),
    })
    expect(item.link).toMatch(/^https?:\/\//)
  }
}

function baseParams(overrides: Record<string, unknown> = {}) {
  return {
    api_credential: CRED_ID,
    query: "JavaScript",
    num: 3,
    ...overrides,
  }
}

describe("google-search e2e (real Google Custom Search API)", () => {
  describe("basic parameters", () => {
    maybeIt("q + num: returns results with correct structure", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ query: "atomemo", num: 3 }),
          credentials: credentials(),
        },
      })

      expect(result).toHaveProperty("totalResults")
      expect(result).toHaveProperty("results")
      expect(typeof result.totalResults).toBe("string")
      const results = result.results as SearchResult[]
      if (results.length > 0) assertResultStructure(results, 3)
    })

    maybeIt("num: respects 1-10 range", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ num: 1 }),
          credentials: credentials(),
        },
      })
      expect((result.results as SearchResult[]).length).toBeLessThanOrEqual(1)
    })
  })

  describe("pagination: start", () => {
    maybeIt("start=1 returns first page", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ start: 1, num: 5 }),
          credentials: credentials(),
        },
      })
      const results = result.results as SearchResult[]
      assertResultStructure(results, 5)
    })

    maybeIt("start=11 returns second page", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ start: 11, num: 3 }),
          credentials: credentials(),
        },
      })
      const results = result.results as SearchResult[]
      assertResultStructure(results, 3)
    })
  })

  describe("dateRestrict", () => {
    maybeIt("dateRestrict=d1 restricts to past day", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "news",
            dateRestrict: "d1",
          }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })

    maybeIt("dateRestrict=w1 restricts to past week", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "technology",
            dateRestrict: "w1",
          }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })
  })

  describe("exactTerms / excludeTerms / orTerms", () => {
    maybeIt("exactTerms filters results", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "programming language",
            exactTerms: "JavaScript",
          }),
          credentials: credentials(),
        },
      })
      const results = result.results as SearchResult[]
      assertResultStructure(results, 3)
      if (results.length > 0) {
        const combined = results
          .map((r) => `${r.title} ${r.snippet}`.toLowerCase())
          .join(" ")
        expect(combined).toContain("javascript")
      }
    })

    maybeIt("excludeTerms excludes specified terms", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "python tutorial",
            excludeTerms: "video",
          }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })
  })

  describe("gl / hl / lr (geolocation & language)", () => {
    maybeIt("gl=us sets geolocation", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ gl: "us" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })

    maybeIt("hl=en sets interface language", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ hl: "en" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })

    maybeIt("lr=lang_en restricts to English", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ lr: "lang_en" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })
  })

  describe("safe", () => {
    maybeIt("safe=off disables SafeSearch", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ safe: "off" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })

    maybeIt("safe=active enables SafeSearch", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ safe: "active" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })
  })

  describe("sort", () => {
    maybeIt("sort=date sorts by date", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "react release",
            sort: "date",
          }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })
  })

  describe("siteSearch / siteSearchFilter", () => {
    maybeIt("siteSearch limits to domain (include)", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "documentation",
            siteSearch: "github.com",
            siteSearchFilter: "i",
          }),
          credentials: credentials(),
        },
      })
      const results = result.results as SearchResult[]
      assertResultStructure(results, 3)
      for (const r of results) {
        expect(r.link.toLowerCase()).toContain("github")
      }
    })
  })

  describe("filter", () => {
    maybeIt("filter=0 turns off duplicate filter", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ filter: "0" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })

    maybeIt("filter=1 turns on duplicate filter", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({ filter: "1" }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      assertResultStructure(result.results as SearchResult[], 3)
    })
  })

  describe("fileType", () => {
    maybeIt("fileType=pdf restricts to PDFs", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "TypeScript handbook",
            fileType: "pdf",
          }),
          credentials: credentials(),
        },
      })
      const results = result.results as SearchResult[]
      assertResultStructure(results, 3)
      for (const r of results) {
        expect(r.link.toLowerCase()).toMatch(/\.pdf(\?|$)/)
      }
    })
  })

  describe("combined parameters", () => {
    maybeIt("combines num + dateRestrict + gl", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "web development",
            num: 5,
            dateRestrict: "m1",
            gl: "us",
          }),
          credentials: credentials(),
        },
      })
      const results = result.results as SearchResult[]
      expect(results.length).toBeLessThanOrEqual(5)
      assertResultStructure(results, 5)
    })

    maybeIt("combines siteSearch + sort", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "changelog",
            siteSearch: "nodejs.org",
            siteSearchFilter: "i",
            sort: "date",
          }),
          credentials: credentials(),
        },
      })
      expect(result).toHaveProperty("results")
      const results = result.results as SearchResult[]
      for (const r of results) {
        expect(r.link.toLowerCase()).toContain("nodejs")
      }
    })
  })

  describe("edge cases", () => {
    maybeIt("returns empty for very niche query", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "xyzabc123unique_nonexistent_9988776655",
          }),
          credentials: credentials(),
        },
      })
      expect(result.results).toEqual([])
      expect(result.totalResults).toBeDefined()
    })

    maybeIt("handles Chinese query", async () => {
      const result = await googleSearchTool.invoke({
        args: {
          parameters: baseParams({
            query: "人工智能 大语言模型",
            num: 4,
          }),
          credentials: credentials(),
        },
      })
      assertResultStructure(result.results as SearchResult[], 4)
    })
  })
})
