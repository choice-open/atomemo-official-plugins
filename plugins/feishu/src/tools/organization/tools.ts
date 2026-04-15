import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuOrganizationBatchGetDepartmentsTool } from "./organization-batch-get-departments"
import { feishuOrganizationBatchGetEmployeeListTool } from "./organization-batch-get-employee-list"
import { feishuOrganizationBatchGetEmployeesTool } from "./organization-batch-get-employees"
import { feishuOrganizationCreateDepartmentTool } from "./organization-create-department"
import { feishuOrganizationCreateEmployeeTool } from "./organization-create-employee"
import { feishuOrganizationDeleteDepartmentTool } from "./organization-delete-department"
import { feishuOrganizationDeleteEmployeeTool } from "./organization-delete-employee"
import { feishuOrganizationListDepartmentsTool } from "./organization-list-departments"
import { feishuOrganizationPatchDepartmentTool } from "./organization-patch-department"
import { feishuOrganizationPatchEmployeeTool } from "./organization-patch-employee"
import { feishuOrganizationSearchDepartmentsTool } from "./organization-search-departments"
import { feishuOrganizationSearchEmployeesTool } from "./organization-search-employees"

export * from "./organization-batch-get-departments"
export * from "./organization-batch-get-employee-list"
export * from "./organization-batch-get-employees"
export * from "./organization-create-department"
export * from "./organization-create-employee"
export * from "./organization-delete-department"
export * from "./organization-delete-employee"
export * from "./organization-list-departments"
export * from "./organization-patch-department"
export * from "./organization-patch-employee"
export * from "./organization-search-departments"
export * from "./organization-search-employees"

export const organizationTools: ToolDefinition[] = [
  feishuOrganizationCreateEmployeeTool,
  feishuOrganizationPatchEmployeeTool,
  feishuOrganizationDeleteEmployeeTool,
  feishuOrganizationBatchGetEmployeesTool,
  feishuOrganizationBatchGetEmployeeListTool,
  feishuOrganizationSearchEmployeesTool,
  feishuOrganizationCreateDepartmentTool,
  feishuOrganizationPatchDepartmentTool,
  feishuOrganizationDeleteDepartmentTool,
  feishuOrganizationBatchGetDepartmentsTool,
  feishuOrganizationListDepartmentsTool,
  feishuOrganizationSearchDepartmentsTool,
]
