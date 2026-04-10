import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { approvalTools } from "./approval/tools"
import { calendarTools } from "./calendar/tools"
import { contactTools } from "./contact/tools"
import { imTools } from "./im/tools"
import { taskTools } from "./task/tools"

/** 全量工具：按模块目录分别定义后在此汇总注册 */
export const allFeishuTools: ToolDefinition[] = [
  ...contactTools,
  ...imTools,
  ...calendarTools,
  ...taskTools,
  ...approvalTools,
]
