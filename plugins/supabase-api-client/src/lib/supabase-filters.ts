/**
 * Advanced filters for Supabase queries.
 * Supports: eq, neq, gt, gte, lt, lte, like, ilike, is, in, contains, containedBy, or.
 * Filters can be:
 * - Legacy: plain object { column: value } → multiple eq
 * - Array: [{ op, column?, value?, valueList? }] with op one of the above
 */

export type FilterSpec =
  | { op: "eq"; column: string; value: unknown }
  | { op: "neq"; column: string; value: unknown }
  | { op: "gt"; column: string; value: unknown }
  | { op: "gte"; column: string; value: unknown }
  | { op: "lt"; column: string; value: unknown }
  | { op: "lte"; column: string; value: unknown }
  | { op: "like"; column: string; value: string }
  | { op: "ilike"; column: string; value: string }
  | { op: "is"; column: string; value: boolean | null }
  | { op: "in"; column: string; value: unknown[] }
  | { op: "contains"; column: string; value: string | unknown[] | Record<string, unknown> }
  | { op: "containedBy"; column: string; value: string | unknown[] | Record<string, unknown> }
  | { op: "or"; value: string }

export type FiltersInput = Record<string, unknown> | FilterSpec[]

function isFilterSpecArray(x: FiltersInput): x is FilterSpec[] {
  return (
    Array.isArray(x) &&
    x.length > 0 &&
    typeof (x[0] as FilterSpec).op === "string"
  )
}

export interface QueryWithFilters {
  eq(column: string, value: unknown): QueryWithFilters
  neq(column: string, value: unknown): QueryWithFilters
  gt(column: string, value: unknown): QueryWithFilters
  gte(column: string, value: unknown): QueryWithFilters
  lt(column: string, value: unknown): QueryWithFilters
  lte(column: string, value: unknown): QueryWithFilters
  like(column: string, pattern: string): QueryWithFilters
  ilike(column: string, pattern: string): QueryWithFilters
  is(column: string, value: boolean | null): QueryWithFilters
  in(column: string, values: unknown[]): QueryWithFilters
  contains(
    column: string,
    value: string | unknown[] | Record<string, unknown>
  ): QueryWithFilters
  containedBy(
    column: string,
    value: string | unknown[] | Record<string, unknown>
  ): QueryWithFilters
  or(filters: string): QueryWithFilters
}

export function applyFiltersAdvanced<T extends QueryWithFilters>(
  query: T,
  filtersInput: FiltersInput | undefined
): T {
  if (filtersInput == null || (typeof filtersInput === "object" && !Array.isArray(filtersInput) && Object.keys(filtersInput).length === 0)) {
    return query
  }

  let chain = query

  if (isFilterSpecArray(filtersInput)) {
    for (const f of filtersInput as FilterSpec[]) {
      switch (f.op) {
        case "eq":
          if (f.value !== undefined && f.value !== null) chain = chain.eq(f.column, f.value) as T
          break
        case "neq":
          chain = chain.neq(f.column, f.value) as T
          break
        case "gt":
          chain = chain.gt(f.column, f.value) as T
          break
        case "gte":
          chain = chain.gte(f.column, f.value) as T
          break
        case "lt":
          chain = chain.lt(f.column, f.value) as T
          break
        case "lte":
          chain = chain.lte(f.column, f.value) as T
          break
        case "like":
          chain = chain.like(f.column, f.value) as T
          break
        case "ilike":
          chain = chain.ilike(f.column, f.value) as T
          break
        case "is":
          chain = chain.is(f.column, f.value) as T
          break
        case "in":
          chain = chain.in(f.column, Array.isArray(f.value) ? f.value : [f.value]) as T
          break
        case "contains":
          chain = chain.contains(f.column, f.value) as T
          break
        case "containedBy":
          chain = chain.containedBy(f.column, f.value) as T
          break
        case "or":
          chain = chain.or(f.value) as T
          break
        default:
          break
      }
    }
  } else {
    const obj = filtersInput as Record<string, unknown>
    for (const [column, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue
      chain = chain.eq(column, value) as T
    }
  }

  return chain as T
}
