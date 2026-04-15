import { z } from "zod"

const employeeIdTypeSchema = z.enum(["open_id", "employee_id", "union_id"])
const departmentIdTypeSchema = z.enum(["open_department_id", "department_id"])

const organizationCommonQuerySchema = z
  .object({
    employee_id_type: employeeIdTypeSchema.optional(),
    department_id_type: departmentIdTypeSchema.optional(),
  })
  .strict()

export function parseOrganizationCreateEmployeeQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationPatchEmployeeQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationDeleteEmployeeQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationBatchGetEmployeesQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationBatchGetEmployeeListQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationSearchEmployeesQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationCreateDepartmentQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationPatchDepartmentQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationDeleteDepartmentQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationBatchGetDepartmentsQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationListDepartmentsQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}

export function parseOrganizationSearchDepartmentsQuery(
  raw: Record<string, unknown>,
) {
  return organizationCommonQuerySchema.parse(raw)
}
