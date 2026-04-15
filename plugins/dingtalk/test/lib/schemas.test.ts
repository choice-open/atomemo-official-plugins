import { describe, expect, it } from "vitest"
import { z } from "zod"
import {
  coercedBool,
  coercedNumber,
  nonEmptyString,
  optionalDateTimeRangeEndMs,
  optionalStringArray,
  optionalTrimmedString,
  parseParams,
  requiredDateTimeRangeStartMs,
  requiredTimestampMs,
  stringArray,
  timestampMs,
} from "../../src/lib/schemas"

describe("nonEmptyString", () => {
  it("passes and trims a valid string", () => {
    expect(nonEmptyString.parse("  hello  ")).toBe("hello")
  })

  it("rejects an empty string", () => {
    expect(() => nonEmptyString.parse("")).toThrow()
  })

  it("rejects a whitespace-only string", () => {
    expect(() => nonEmptyString.parse("   ")).toThrow()
  })
})

describe("optionalTrimmedString", () => {
  it("returns undefined for undefined", () => {
    expect(optionalTrimmedString.parse(undefined)).toBeUndefined()
  })

  it("returns undefined for null", () => {
    expect(optionalTrimmedString.parse(null)).toBeUndefined()
  })

  it("returns undefined for empty string", () => {
    expect(optionalTrimmedString.parse("")).toBeUndefined()
  })

  it("returns undefined for whitespace-only string", () => {
    expect(optionalTrimmedString.parse("  ")).toBeUndefined()
  })

  it("trims and returns a non-empty string", () => {
    expect(optionalTrimmedString.parse("  hello  ")).toBe("hello")
  })
})

describe("coercedNumber", () => {
  it("passes a number through", () => {
    expect(coercedNumber.parse(42)).toBe(42)
  })

  it("coerces a numeric string", () => {
    expect(coercedNumber.parse("7")).toBe(7)
  })

  it("rejects null without a default", () => {
    expect(() => coercedNumber.parse(null)).toThrow()
  })

  it("rejects null (Zod .default() only intercepts undefined, not null)", () => {
    // null passes through ZodDefault unchanged, becomes undefined in the
    // preprocess, then z.number() rejects it. Absent fields (undefined) work.
    expect(() => coercedNumber.default(0).parse(null)).toThrow()
  })

  it("returns default when input is undefined", () => {
    expect(coercedNumber.default(20).parse(undefined)).toBe(20)
  })
})

describe("coercedBool", () => {
  it("passes true through", () => {
    expect(coercedBool.parse(true)).toBe(true)
  })

  it("passes false through", () => {
    expect(coercedBool.parse(false)).toBe(false)
  })

  it("converts undefined to false", () => {
    expect(coercedBool.parse(undefined)).toBe(false)
  })

  it("converts null to false", () => {
    expect(coercedBool.parse(null)).toBe(false)
  })
})

describe("stringArray", () => {
  it("passes an existing array through", () => {
    expect(stringArray.parse(["a", "b"])).toEqual(["a", "b"])
  })

  it("falls back to [] for undefined", () => {
    expect(stringArray.parse(undefined)).toEqual([])
  })

  it("falls back to [] for a non-array value", () => {
    expect(stringArray.parse("not-an-array")).toEqual([])
  })
})

describe("optionalStringArray", () => {
  it("returns the array when non-empty", () => {
    expect(optionalStringArray.parse(["RUNNING"])).toEqual(["RUNNING"])
  })

  it("returns undefined for an empty array", () => {
    expect(optionalStringArray.parse([])).toBeUndefined()
  })

  it("returns undefined for undefined", () => {
    expect(optionalStringArray.parse(undefined)).toBeUndefined()
  })

  it("returns undefined for a non-array value", () => {
    expect(optionalStringArray.parse("not-an-array")).toBeUndefined()
  })
})

describe("timestampMs", () => {
  it("passes a numeric millisecond value through", () => {
    expect(timestampMs.parse(1_700_000_000_000)).toBe(1_700_000_000_000)
  })

  it("coerces a numeric string", () => {
    expect(timestampMs.parse("1700000000000")).toBe(1_700_000_000_000)
  })

  it("coerces an ISO date string to ms", () => {
    const result = timestampMs.parse("2024-01-15T00:00:00.000Z")
    expect(typeof result).toBe("number")
    expect(result).toBeGreaterThan(0)
  })

  it("returns undefined for empty string", () => {
    expect(timestampMs.parse("")).toBeUndefined()
  })

  it("returns undefined for undefined", () => {
    expect(timestampMs.parse(undefined)).toBeUndefined()
  })

  it("returns undefined for an invalid date string", () => {
    expect(timestampMs.parse("not-a-date")).toBeUndefined()
  })
})

describe("requiredTimestampMs", () => {
  it("accepts a valid numeric timestamp", () => {
    expect(requiredTimestampMs.parse(1_700_000_000_000)).toBe(1_700_000_000_000)
  })

  it("coerces a numeric string", () => {
    expect(requiredTimestampMs.parse("1700000000000")).toBe(1_700_000_000_000)
  })

  it("throws for empty string", () => {
    expect(() => requiredTimestampMs.parse("")).toThrow()
  })

  it("throws for undefined", () => {
    expect(() => requiredTimestampMs.parse(undefined)).toThrow()
  })

  it("throws for an invalid date string", () => {
    expect(() => requiredTimestampMs.parse("not-a-date")).toThrow()
  })
})

describe("parseParams", () => {
  const schema = z.object({
    name: nonEmptyString,
    count: coercedNumber.default(0),
  })

  it("returns parsed data for valid input", () => {
    expect(parseParams(schema, { name: "  Alice  ", count: "5" })).toEqual({
      name: "Alice",
      count: 5,
    })
  })

  it("throws a readable error for invalid input", () => {
    expect(() => parseParams(schema, { name: "" })).toThrow()
  })
})

describe("requiredDateTimeRangeStartMs", () => {
  it("requires a value", () => {
    expect(() => requiredDateTimeRangeStartMs.parse(undefined)).toThrow(
      /Invalid date\/time/,
    )
  })

  it("passes a numeric timestamp through", () => {
    expect(requiredDateTimeRangeStartMs.parse(1_700_000_000_000)).toBe(
      1_700_000_000_000,
    )
  })

  it("parses a numeric string", () => {
    expect(requiredDateTimeRangeStartMs.parse("1700000000000")).toBe(
      1_700_000_000_000,
    )
  })

  it("parses ISO datetimes with timezone", () => {
    expect(
      requiredDateTimeRangeStartMs.parse("2026-04-15T14:30:00+08:00"),
    ).toBe(new Date("2026-04-15T14:30:00+08:00").getTime())
  })

  it("parses date-only inputs at start of day", () => {
    expect(requiredDateTimeRangeStartMs.parse("2026-04-15")).toBe(
      new Date(2026, 3, 15, 0, 0, 0, 0).getTime(),
    )
  })

  it("parses English month-name datetimes", () => {
    expect(requiredDateTimeRangeStartMs.parse("April 15, 2026 2:30 PM")).toBe(
      new Date(2026, 3, 15, 14, 30, 0, 0).getTime(),
    )
  })

  it("parses Chinese datetimes with colon separators", () => {
    expect(requiredDateTimeRangeStartMs.parse("2026年4月15日 14:30")).toBe(
      new Date(2026, 3, 15, 14, 30, 0, 0).getTime(),
    )
  })

  it("parses Chinese datetimes with Chinese time units", () => {
    expect(
      requiredDateTimeRangeStartMs.parse("2026年4月15日 14时30分20秒"),
    ).toBe(new Date(2026, 3, 15, 14, 30, 20, 0).getTime())
  })

  it("rejects ambiguous numeric dates", () => {
    expect(() => requiredDateTimeRangeStartMs.parse("04/05/2026")).toThrow(
      /Invalid date\/time/,
    )
  })

  it("rejects partial dates", () => {
    expect(() => requiredDateTimeRangeStartMs.parse("2026-04")).toThrow(
      /Invalid date\/time/,
    )
    expect(() => requiredDateTimeRangeStartMs.parse("2026年4月")).toThrow(
      /Invalid date\/time/,
    )
  })

  it("rejects relative phrases", () => {
    expect(() => requiredDateTimeRangeStartMs.parse("today")).toThrow(
      /Invalid date\/time/,
    )
    expect(() => requiredDateTimeRangeStartMs.parse("最近7天")).toThrow(
      /Invalid date\/time/,
    )
  })
})

describe("optionalDateTimeRangeEndMs", () => {
  it("returns undefined for missing input", () => {
    expect(optionalDateTimeRangeEndMs.parse(undefined)).toBeUndefined()
  })

  it("parses date-only inputs at end of day", () => {
    expect(optionalDateTimeRangeEndMs.parse("2026-04-15")).toBe(
      new Date(2026, 3, 15, 23, 59, 59, 999).getTime(),
    )
  })
})
