import { describe, expect, it } from "vitest"
import {
  contactDeleteUserBodySchema,
  contactDeleteUserQuerySchema,
} from "../../../src/tools/contact/contact-delete-user.zod"

describe("contactDeleteUserQuerySchema", () => {
  it("accepts empty query", () => {
    expect(contactDeleteUserQuerySchema.parse({})).toEqual({})
  })

  it("accepts user_id_type", () => {
    expect(
      contactDeleteUserQuerySchema.parse({ user_id_type: "union_id" }),
    ).toEqual({ user_id_type: "union_id" })
  })

  it("rejects unknown keys", () => {
    expect(() =>
      contactDeleteUserQuerySchema.parse({ department_id_type: "x" }),
    ).toThrow()
  })
})

describe("contactDeleteUserBodySchema", () => {
  it("accepts empty body", () => {
    expect(contactDeleteUserBodySchema.parse({})).toEqual({})
  })

  it("accepts email_acceptor", () => {
    expect(
      contactDeleteUserBodySchema.parse({
        email_acceptor: {
          processing_type: "1",
          acceptor_user_id: "ou-xxx",
        },
      }),
    ).toMatchObject({
      email_acceptor: { processing_type: "1", acceptor_user_id: "ou-xxx" },
    })
  })

  it("rejects unknown body keys", () => {
    expect(() => contactDeleteUserBodySchema.parse({ extra: true })).toThrow()
  })
})
