import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_weibo_post_reposts } from "./fetch-status-reposts"

export const weiboAppTools: ToolDefinition[] = [tikhub_weibo_post_reposts]
