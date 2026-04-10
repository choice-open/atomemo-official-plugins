import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { feishuContactBatchAddUsersTool } from "./contact-batch-add-users"
import { feishuContactBatchGetDepartmentsTool } from "./contact-batch-get-departments"
import { feishuContactBatchGetUserIdsTool } from "./contact-batch-get-user-ids"
import { feishuContactBatchGetUsersTool } from "./contact-batch-get-users"
import { feishuContactCreateDepartmentTool } from "./contact-create-department"
import { feishuContactCreateUserTool } from "./contact-create-user"
import { feishuContactDeleteDepartmentTool } from "./contact-delete-department"
import { feishuContactDeleteUserTool } from "./contact-delete-user"
import { feishuContactFindUsersTool } from "./contact-find-users"
import { feishuContactFindUsersByDepartmentTool } from "./contact-find-users-by-department"
import { feishuContactGetDepartmentTool } from "./contact-get-department"
import { feishuContactGetDepartmentChildrenTool } from "./contact-get-department-children"
import { feishuContactGetDepartmentGroupsTool } from "./contact-get-department-groups"
import { feishuContactGetDepartmentParentTool } from "./contact-get-department-parent"
import { feishuContactGetScopeTool } from "./contact-get-scope"
import { feishuContactGetUserTool } from "./contact-get-user"
import { feishuContactListDepartmentsTool } from "./contact-list-departments"
import { feishuContactPatchDepartmentTool } from "./contact-patch-department"
import { feishuContactPatchUserTool } from "./contact-patch-user"
import { feishuContactPutDepartmentTool } from "./contact-put-department"
import { feishuContactRecoverUserTool } from "./contact-recover-user"
import { feishuContactSearchDepartmentsTool } from "./contact-search-departments"
import { feishuContactSearchUsersTool } from "./contact-search-users"

export * from "./contact-batch-add-users"
export * from "./contact-batch-get-departments"
export * from "./contact-batch-get-user-ids"
export * from "./contact-batch-get-users"
export * from "./contact-create-department"
export * from "./contact-create-user"
export * from "./contact-delete-department"
export * from "./contact-delete-user"
export * from "./contact-find-users"
export * from "./contact-find-users-by-department"
export * from "./contact-get-department"
export * from "./contact-get-department-children"
export * from "./contact-get-department-groups"
export * from "./contact-get-department-parent"
export * from "./contact-get-scope"
export * from "./contact-get-user"
export * from "./contact-list-departments"
export * from "./contact-patch-department"
export * from "./contact-patch-user"
export * from "./contact-put-department"
export * from "./contact-recover-user"
export * from "./contact-search-departments"
export * from "./contact-search-users"

export const contactTools: ToolDefinition[] = [
  feishuContactCreateUserTool,
  feishuContactPatchUserTool,
  feishuContactDeleteUserTool,
  feishuContactBatchGetUsersTool,
  feishuContactFindUsersTool,
  feishuContactSearchUsersTool,
  feishuContactCreateDepartmentTool,
  feishuContactPatchDepartmentTool,
  feishuContactDeleteDepartmentTool,
  feishuContactBatchGetDepartmentsTool,
  feishuContactListDepartmentsTool,
  feishuContactSearchDepartmentsTool,
  feishuContactGetUserTool,
  feishuContactFindUsersByDepartmentTool,
  feishuContactBatchGetUserIdsTool,
  feishuContactRecoverUserTool,
  feishuContactBatchAddUsersTool,
  feishuContactGetDepartmentTool,
  feishuContactGetDepartmentChildrenTool,
  feishuContactGetDepartmentParentTool,
  feishuContactPutDepartmentTool,
  feishuContactGetDepartmentGroupsTool,
  feishuContactGetScopeTool,
]
