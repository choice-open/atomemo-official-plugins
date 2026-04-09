import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import tavilyResearchSkill from "./tavily-research-skill.md" with { type: "text" }
import { getTavilyClient } from "../tavily/tavily-client"
import {
  getTavilyApiKeyFromCredentials,
  parseJsonObject,
  replaceUndefinedWithNull,
} from "../tavily/tavily-utils"

function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return (
    value != null &&
    (typeof value === "object" || typeof value === "function") &&
    Symbol.asyncIterator in (value as any)
  )
}

async function consumeResearchStream(stream: AsyncIterable<unknown>): Promise<string> {
  let text = ""
  for await (const chunk of stream) {
    if (typeof chunk === "string") text += chunk
    else if (chunk instanceof Uint8Array) text += Buffer.from(chunk).toString("utf-8")
    else if (chunk instanceof ArrayBuffer) text += Buffer.from(chunk).toString("utf-8")
    else text += String(chunk)
  }
  return text
}

const RESEARCH_POLL_INTERVAL_MS = 5_000
const RESEARCH_MAX_POLLS = 120

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isTerminalStatus(status: unknown): boolean {
  if (typeof status !== "string") return false
  const normalized = status.toLowerCase()
  return (
    normalized === "completed" ||
    normalized === "done" ||
    normalized === "failed" ||
    normalized === "error" ||
    normalized === "cancelled"
  )
}

type TavilyResearchParameters = {
  tavily_credential?: string
  input: string
  model?: string
  stream?: boolean
  citation_format?: string
  output_schema_json?: string
  advanced_options_json?: string
}

function resolveApiKey(args: { credentials?: unknown }): string {
  const apiKey = getTavilyApiKeyFromCredentials(args.credentials)
  if (apiKey) return apiKey
  throw new Error("Missing Tavily credentials. Create/select the `tavily` credential in the tool UI.")
}

export const tavilyResearchTool: ToolDefinition = {
  name: "tavily-research",
  display_name: { en_US: "Tavily Research", zh_Hans: "Tavily 调研" },
  description: { en_US: "Research a topic using Tavily", zh_Hans: "使用 Tavily 对主题进行调研" },
  skill: tavilyResearchSkill,
  icon: "🧠",
  parameters: [
    {
      name: "tavily_credential",
      type: "credential_id",
      required: true,
      credential_name: "tavily",
      display_name: { en_US: "Tavily Credential", zh_Hans: "Tavily 凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "input",
      type: "string",
      required: true,
      display_name: { en_US: "Research input", zh_Hans: "调研内容" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "model",
      type: "string",
      required: false,
      display_name: { en_US: "Model", zh_Hans: "模型" },
      ui: { component: "input" },
      enum: ["mini", "pro", "auto"],
    },
    {
      name: "stream",
      type: "boolean",
      required: false,
      display_name: { en_US: "Stream", zh_Hans: "流式输出" },
      ui: { component: "switch" },
    },
    {
      name: "citation_format",
      type: "string",
      required: false,
      display_name: { en_US: "Citation format", zh_Hans: "引用格式" },
      ui: { component: "input" },
      enum: ["numbered", "mla", "apa", "chicago"],
    },
    {
      name: "output_schema_json",
      type: "string",
      required: false,
      display_name: { en_US: "Output schema (JSON)", zh_Hans: "输出模式（JSON）" },
      ui: { component: "code-editor", language: "json", support_expression: true, width: "full" },
    },
    {
      name: "advanced_options_json",
      type: "string",
      required: false,
      display_name: { en_US: "Advanced options JSON", zh_Hans: "高级选项 JSON" },
      ui: { component: "code-editor", language: "json", support_expression: true, width: "full" },
    },
  ],
  async invoke({ args }) {
    const parameters = args.parameters as TavilyResearchParameters
    const apiKey = resolveApiKey({ credentials: args.credentials })

    if (parameters.stream === true) {
      throw new Error("Streaming (`stream: true`) is not supported by this plugin tool yet.")
    }

    const options: Record<string, unknown> = {}

    if (parameters.model) options.model = parameters.model
    if (parameters.citation_format) options.citationFormat = parameters.citation_format

    if (parameters.output_schema_json) {
      options.outputSchema = parseJsonObject(parameters.output_schema_json)
    }

    const extra = parseJsonObject(parameters.advanced_options_json)
    const finalOptions = extra ? { ...options, ...extra } : options

    const client = getTavilyClient(apiKey)
    const result = await client.research(parameters.input, finalOptions)

    if (isAsyncIterable(result)) {
      return replaceUndefinedWithNull({
        streamed: true,
        content: await consumeResearchStream(result),
      }) as any
    }

    const baseResult = result as Record<string, unknown>
    const requestId = baseResult.requestId
    const status = baseResult.status

    if (typeof requestId === "string" && requestId && !isTerminalStatus(status)) {
      let latest: Record<string, unknown> = baseResult
      for (let i = 0; i < RESEARCH_MAX_POLLS; i += 1) {
        await sleep(RESEARCH_POLL_INTERVAL_MS)
        latest = (await client.getResearch(requestId)) as Record<string, unknown>
        const polledStatus = latest.status
        if (isTerminalStatus(polledStatus)) {
          return replaceUndefinedWithNull(latest) as any
        }
      }

      // Timeout guard: still return the latest known state.
      return replaceUndefinedWithNull(latest) as any
    }

    return replaceUndefinedWithNull(result) as any
  },
}

