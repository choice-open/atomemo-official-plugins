import { describe, expect, it } from "vitest"
import { sanitizeObject } from "../../src/lib/sanitize-object"

describe("sanitizeObject", () => {
  it("returns null for null and undefined", () => {
    expect(sanitizeObject(null)).toBe(null)
    expect(sanitizeObject(undefined)).toBe(null)
  })

  it("passes through primitives", () => {
    expect(sanitizeObject("hello")).toBe("hello")
    expect(sanitizeObject(42)).toBe(42)
    expect(sanitizeObject(true)).toBe(true)
    expect(sanitizeObject(false)).toBe(false)
  })

  it("converts Date to ISO string", () => {
    const d = new Date("2025-03-23T10:00:00.000Z")
    expect(sanitizeObject(d)).toBe("2025-03-23T10:00:00.000Z")
  })

  it("recursively sanitizes arrays", () => {
    const arr = [1, "a", null, new Date("2025-01-01")]
    expect(sanitizeObject(arr)).toEqual([
      1,
      "a",
      null,
      "2025-01-01T00:00:00.000Z",
    ])
  })

  it("recursively sanitizes objects", () => {
    const obj = {
      a: 1,
      b: "x",
      c: { nested: new Date("2025-01-01") },
    }
    expect(sanitizeObject(obj)).toEqual({
      a: 1,
      b: "x",
      c: { nested: "2025-01-01T00:00:00.000Z" },
    })
  })

  it("converts non-JSON-serializable values to null", () => {
    expect(sanitizeObject(() => {})).toBe(null)
    expect(sanitizeObject(Symbol("test"))).toBe(null)
    expect(sanitizeObject(123n)).toBe(null)
  })
})
