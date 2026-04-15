import { describe, expect, it } from "vitest"
import {
  contactGetUserBodySchema,
  contactGetUserQuerySchema,
} from "../../../src/tools/contact/contact-get-user.zod"

describe("contactGetUserQuerySchema", () => {
  it("accepts empty query", () => {
    expect(contactGetUserQuerySchema.parse({})).toEqual({})
  })

  it("accepts documented optional params", () => {
    expect(
      contactGetUserQuerySchema.parse({
        user_id_type: "user_id",
        department_id_type: "department_id",
      }),
    ).toEqual({
      user_id_type: "user_id",
      department_id_type: "department_id",
    })
  })

  it("rejects unknown keys", () => {
    expect(() => contactGetUserQuerySchema.parse({ foo: 1 })).toThrow()
  })
})

describe("contactGetUserBodySchema", () => {
  it("accepts empty body", () => {
    expect(contactGetUserBodySchema.parse({})).toEqual({})
  })

  it("rejects non-empty body", () => {
    expect(() => contactGetUserBodySchema.parse({ x: 1 })).toThrow()
  })
})
