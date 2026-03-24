import { jwtVerify } from "jose"
import { describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}))

// Mock i18n
vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US", "zh-Hans"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {}, zh_Hans: {} }),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { jwtTool } from "../src/tools/jwt"

describe("token-forge plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "token-forge",
        display_name: { en_US: "Token Forge" },
        description: {
          en_US:
            "A plugin for generating signed tokens (JWT, etc.) for API authentication",
        },
        icon: "https://server-media-public.atomemo.ai/icons/token-forge.svg",
        lang: "typescript",
        version: "0.0.1",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/token-forge",
        locales: ["en-US", "zh-Hans"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(typeof plugin.addTool).toBe("function")
      expect(plugin.run).toBeDefined()
      expect(typeof plugin.run).toBe("function")
    })

    it("should call all initialization methods when imported", async () => {
      const addTool = vi.fn()
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        run,
      })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addTool).toHaveBeenCalledWith(jwtTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("jwt tool", () => {
    it("should have correct properties", () => {
      expect(jwtTool).toEqual(
        expect.objectContaining({
          name: "jwt-generator",
          icon: "https://server-media-public.atomemo.ai/icons/jwt.svg",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "algorithm",
              type: "string",
              required: true,
            }),
            expect.objectContaining({
              name: "access_key",
              type: "string",
              required: true,
            }),
            expect.objectContaining({
              name: "secret_key",
              type: "string",
              required: true,
            }),
            expect.objectContaining({
              name: "expires_in",
              type: "number",
              required: false,
            }),
            expect.objectContaining({
              name: "additional_claims",
              type: "object",
              required: false,
            }),
          ]),
        }),
      )
    })

    it("should generate a valid HS256 JWT token with default parameters", async () => {
      const now = Math.floor(Date.now() / 1000)
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "test_ak",
            secret_key: "test_sk",
          },
        },
      })

      expect(result).toHaveProperty("token")
      const token = result.token as string

      // Verify it's a 3-part JWT
      const parts = token.split(".")
      expect(parts).toHaveLength(3)

      // Decode and verify header
      const header = JSON.parse(atob(parts[0]))
      expect(header.alg).toBe("HS256")
      expect(header.typ).toBe("JWT")

      // Decode and verify payload
      const payload = JSON.parse(atob(parts[1]))
      expect(payload.iss).toBe("test_ak")
      expect(payload.exp).toBeGreaterThanOrEqual(now + 1800 - 1)
      expect(payload.exp).toBeLessThanOrEqual(now + 1800 + 1)
      expect(payload.nbf).toBeGreaterThanOrEqual(now - 5 - 1)
      expect(payload.nbf).toBeLessThanOrEqual(now - 5 + 1)
    })

    it("should support custom expires_in", async () => {
      const now = Math.floor(Date.now() / 1000)
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "test_ak",
            secret_key: "test_sk",
            expires_in: 3600,
          },
        },
      })

      const token = result.token as string
      const payload = JSON.parse(atob(token.split(".")[1]))
      expect(payload.exp).toBeGreaterThanOrEqual(now + 3600 - 1)
      expect(payload.exp).toBeLessThanOrEqual(now + 3600 + 1)
    })

    it("should merge additional_claims into payload", async () => {
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "test_ak",
            secret_key: "test_sk",
            additional_claims: { sub: "user123", role: "admin" },
          },
        },
      })

      const token = result.token as string
      const payload = JSON.parse(atob(token.split(".")[1]))
      expect(payload.sub).toBe("user123")
      expect(payload.role).toBe("admin")
      expect(payload.iss).toBe("test_ak")
      expect(payload.exp).toBeDefined()
      expect(payload.nbf).toBeDefined()
    })

    it("should allow additional_claims to override exp", async () => {
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "test_ak",
            secret_key: "test_sk",
            additional_claims: { exp: 9999999999 },
          },
        },
      })

      const token = result.token as string
      const payload = JSON.parse(atob(token.split(".")[1]))
      expect(payload.exp).toBe(9999999999)
    })

    it("should allow additional_claims to override nbf", async () => {
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "test_ak",
            secret_key: "test_sk",
            additional_claims: { nbf: 1000000000 },
          },
        },
      })

      const token = result.token as string
      const payload = JSON.parse(atob(token.split(".")[1]))
      expect(payload.nbf).toBe(1000000000)
    })

    it("should NOT allow additional_claims to override iss", async () => {
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "real_ak",
            secret_key: "test_sk",
            additional_claims: { iss: "fake_ak" },
          },
        },
      })

      const token = result.token as string
      const payload = JSON.parse(atob(token.split(".")[1]))
      expect(payload.iss).toBe("real_ak")
    })

    it("should throw Error when secret_key is empty", async () => {
      await expect(
        jwtTool.invoke({
          args: {
            parameters: {
              algorithm: "HS256",
              access_key: "test_ak",
              secret_key: "",
            },
          },
        }),
      ).rejects.toThrow("secret_key must not be empty")
    })

    it("should produce a token that can be verified with the same secret", async () => {
      const secretKey = "my_super_secret_key"
      const result = await jwtTool.invoke({
        args: {
          parameters: {
            algorithm: "HS256",
            access_key: "test_ak",
            secret_key: secretKey,
          },
        },
      })

      const token = result.token as string
      const secret = new TextEncoder().encode(secretKey)

      const { payload } = await jwtVerify(token, secret)
      expect(payload.iss).toBe("test_ak")
    })
  })
})
