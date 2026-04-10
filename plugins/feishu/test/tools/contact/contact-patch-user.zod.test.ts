import { describe, expect, it } from "vitest"
import {
  contactPatchUserBodySchema,
  contactPatchUserQuerySchema,
} from "../../../src/tools/contact/contact-patch-user.zod"

describe("contactPatchUserQuerySchema", () => {
  it("accepts empty query", () => {
    expect(contactPatchUserQuerySchema.parse({})).toEqual({})
  })

  it("rejects unknown keys", () => {
    expect(() =>
      contactPatchUserQuerySchema.parse({ client_token: "x" }),
    ).toThrow()
  })
})

describe("contactPatchUserBodySchema", () => {
  it("accepts empty partial update", () => {
    expect(contactPatchUserBodySchema.parse({})).toEqual({})
  })

  it("accepts documented optional fields", () => {
    const parsed = contactPatchUserBodySchema.parse({
      name: "李四",
      mobile: "13800138000",
      orders: [
        {
          department_id: "od-1",
          user_order: 1,
          is_primary_dept: true,
        },
      ],
    })
    expect(parsed.name).toBe("李四")
    expect(parsed.orders).toHaveLength(1)
  })

  it("rejects unknown top-level keys", () => {
    expect(() => contactPatchUserBodySchema.parse({ not_in_doc: 1 })).toThrow()
  })
})
