/** 从 tool 参数构造通讯录/组织类接口的查询对象（与 organization.zod 字段一致） */

export function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export function buildOrganizationQueryParams(
  p: Record<string, unknown>,
): Record<string, unknown> {
  const employeeIdType = optionalString(p.employee_id_type)
  const departmentIdType = optionalString(p.department_id_type)
  return {
    ...(employeeIdType ? { employee_id_type: employeeIdType } : {}),
    ...(departmentIdType ? { department_id_type: departmentIdType } : {}),
  }
}
