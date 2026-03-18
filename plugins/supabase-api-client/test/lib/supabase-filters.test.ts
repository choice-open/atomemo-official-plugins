import { describe, expect, it } from "vitest"
import {
  applyFiltersAdvanced,
  type FilterSpec,
  type FiltersInput,
} from "../../src/lib/supabase-filters"

function createMockQuery() {
  const calls: { method: string; args: unknown[] }[] = []
  const chain = new Proxy(
    {},
    {
      get(_, prop: string) {
        return (...args: unknown[]) => {
          calls.push({ method: prop, args })
          return chain
        }
      },
    },
  )
  return { chain, calls }
}

describe("applyFiltersAdvanced", () => {
  it("filters 为 null 或 undefined 时返回原 query", () => {
    const { chain, calls } = createMockQuery()
    const result = applyFiltersAdvanced(chain as any, undefined)
    expect(result).toBe(chain)
    expect(calls).toHaveLength(0)
  })

  it("filters 为空对象时返回原 query", () => {
    const { chain, calls } = createMockQuery()
    const result = applyFiltersAdvanced(chain as any, {})
    expect(result).toBe(chain)
    expect(calls).toHaveLength(0)
  })

  it("legacy 格式: 普通对象转换为多个 eq", () => {
    const { chain, calls } = createMockQuery()
    const filters: FiltersInput = { id: 1, name: "test" }
    applyFiltersAdvanced(chain as any, filters)
    expect(calls).toHaveLength(2)
    expect(calls[0]).toEqual({ method: "eq", args: ["id", 1] })
    expect(calls[1]).toEqual({ method: "eq", args: ["name", "test"] })
  })

  it("legacy 格式: 跳过 null 和 undefined 值", () => {
    const { chain, calls } = createMockQuery()
    const filters: FiltersInput = { id: 1, skip: null, also: undefined }
    applyFiltersAdvanced(chain as any, filters)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ method: "eq", args: ["id", 1] })
  })

  it("FilterSpec 数组: eq", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [{ op: "eq", column: "id", value: 1 }]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ method: "eq", args: ["id", 1] })
  })

  it("FilterSpec 数组: eq 跳过 undefined/null value", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [
      { op: "eq", column: "id", value: null },
      { op: "eq", column: "name", value: undefined },
    ]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls).toHaveLength(0)
  })

  it("FilterSpec 数组: neq, gt, gte, lt, lte", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [
      { op: "neq", column: "status", value: "deleted" },
      { op: "gt", column: "age", value: 18 },
      { op: "gte", column: "score", value: 60 },
      { op: "lt", column: "price", value: 100 },
      { op: "lte", column: "count", value: 10 },
    ]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls).toHaveLength(5)
    expect(calls[0]).toEqual({ method: "neq", args: ["status", "deleted"] })
    expect(calls[1]).toEqual({ method: "gt", args: ["age", 18] })
    expect(calls[2]).toEqual({ method: "gte", args: ["score", 60] })
    expect(calls[3]).toEqual({ method: "lt", args: ["price", 100] })
    expect(calls[4]).toEqual({ method: "lte", args: ["count", 10] })
  })

  it("FilterSpec 数组: like, ilike", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [
      { op: "like", column: "name", value: "%test%" },
      { op: "ilike", column: "email", value: "%@example.com" },
    ]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls[0]).toEqual({ method: "like", args: ["name", "%test%"] })
    expect(calls[1]).toEqual({ method: "ilike", args: ["email", "%@example.com"] })
  })

  it("FilterSpec 数组: is (null)", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [{ op: "is", column: "deleted_at", value: null }]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls[0]).toEqual({ method: "is", args: ["deleted_at", null] })
  })

  it("FilterSpec 数组: in", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [
      { op: "in", column: "id", value: [1, 2, 3] },
    ]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls[0]).toEqual({ method: "in", args: ["id", [1, 2, 3]] })
  })

  it("FilterSpec 数组: contains, containedBy", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [
      { op: "contains", column: "tags", value: ["a", "b"] },
      { op: "containedBy", column: "range", value: { start: 0, end: 10 } },
    ]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls[0]).toEqual({ method: "contains", args: ["tags", ["a", "b"]] })
    expect(calls[1]).toEqual({
      method: "containedBy",
      args: ["range", { start: 0, end: 10 }],
    })
  })

  it("FilterSpec 数组: or", () => {
    const { chain, calls } = createMockQuery()
    const filters: FilterSpec[] = [
      { op: "or", value: "id.eq.1,id.eq.2" },
    ]
    applyFiltersAdvanced(chain as any, filters)
    expect(calls[0]).toEqual({ method: "or", args: ["id.eq.1,id.eq.2"] })
  })
})
