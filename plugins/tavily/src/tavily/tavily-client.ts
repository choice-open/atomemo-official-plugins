import { tavily, type TavilyClient } from "@tavily/core"

const DEFAULT_TAVILY_BASE_URL = "https://api.tavily.com"

function getApiBaseUrl(): string | undefined {
  const baseUrl = process.env.TAVILY_BASE_URL?.trim()
  if (!baseUrl) return undefined
  return baseUrl
}

export function getTavilyClient(apiKey: string): TavilyClient {
  return tavily({
    apiKey,
    apiBaseURL: getApiBaseUrl() ?? DEFAULT_TAVILY_BASE_URL,
    projectId: process.env.TAVILY_PROJECT?.trim() || undefined,
  })
}

