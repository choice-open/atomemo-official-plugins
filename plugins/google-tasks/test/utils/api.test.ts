import { describe, expect, it } from "vitest"
import { getAccessToken, toJSON } from "../../src/utils/api"

describe("getAccessToken", () => {
  const credentialId = "cred-1"

  it("should extract access_token from credentials", () => {
    const args = {
      parameters: { credential_id: credentialId },
      credentials: { [credentialId]: { access_token: "test-token-123" } },
    }
    expect(getAccessToken(args)).toBe("test-token-123")
  })

  it("should throw when credentials object is missing", () => {
    const args = { parameters: { credential_id: credentialId } }
    expect(() => getAccessToken(args)).toThrow("Missing access token")
  })

  it("should throw when credential_id does not match any credential", () => {
    const args = {
      parameters: { credential_id: credentialId },
      credentials: { "other-id": { access_token: "token" } },
    }
    expect(() => getAccessToken(args)).toThrow("Missing access token")
  })

  it("should throw when access_token is empty string", () => {
    const args = {
      parameters: { credential_id: credentialId },
      credentials: { [credentialId]: { access_token: "" } },
    }
    expect(() => getAccessToken(args)).toThrow("Missing access token")
  })
})

describe("toJSON", () => {
  it("should convert a plain object", () => {
    expect(toJSON({ a: 1, b: "hello" })).toEqual({ a: 1, b: "hello" })
  })

  it("should deep-clone nested objects", () => {
    const src = { nested: { value: 42 } }
    const result = toJSON(src)
    expect(result).toEqual(src)
    expect(result.nested).not.toBe(src.nested)
  })

  it("should strip undefined values", () => {
    const result = toJSON({ a: 1, b: undefined })
    expect(result).toEqual({ a: 1 })
    expect("b" in result).toBe(false)
  })

  it("should handle null values", () => {
    expect(toJSON({ a: null })).toEqual({ a: null })
  })

  it("should handle arrays", () => {
    expect(toJSON({ items: [1, 2, 3] })).toEqual({ items: [1, 2, 3] })
  })
})
