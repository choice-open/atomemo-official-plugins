import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { approvalTools } from "./approval/tools";
import { calendarTools } from "./calendar/tools";
import { imTools } from "./im/tools";
import { taskTools } from "./task/tools";
import { organizationTools } from "./organization";

/** 全量工具：按模块目录分别定义后在此汇总注册 */
export const allFeishuTools: ToolDefinition[] = [
  ...organizationTools,
  ...imTools,
  ...calendarTools,
  ...taskTools,
  // ...approvalTools,
];
