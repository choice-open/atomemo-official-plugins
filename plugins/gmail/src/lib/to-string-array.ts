/**
 * 将参数值规范为字符串数组。
 * 支持：逗号分隔的字符串、"a,b,c"；或已是数组 ["a","b","c"]
 */
export function toStringArray(
  value: string | string[] | undefined | null,
): string[] {
  if (value == null) return []
  if (Array.isArray(value)) {
    return value
      .filter((v) => typeof v === "string")
      .map((v) => String(v).trim())
      .filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}
