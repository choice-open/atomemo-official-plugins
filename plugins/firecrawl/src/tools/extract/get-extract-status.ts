import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const GetExtractStatusTool: ToolDefinition = {
  name: "firecrawl-get-extract-status",
  display_name: {
    en_US: "Firecrawl Get Extract Status",
    zh_Hans_CN: "Firecrawl 获取提取状态",
  },
  description: {
    en_US: "Get the status of an extract job.",
    zh_Hans_CN: "获取提取任务的状态。",
  },
  icon: "📊",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "id",
      display_name: {
        en_US: "ID",
        zh_Hans_CN: "ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the extract job.",
          zh_Hans_CN: "提取任务的 ID。",
        },
        support_expression: true,
      },
    },
  ],
  invoke: notImplementedToolInvoke,
}
