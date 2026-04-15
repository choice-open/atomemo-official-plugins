import { describe, expect, it } from "vitest"
import {
  contactCreateUserBodySchema,
  contactCreateUserQuerySchema,
} from "../../../src/tools/contact/contact-create-user.zod"

describe("contactCreateUserQuerySchema", () => {
  it("accepts empty query object", () => {
    expect(contactCreateUserQuerySchema.parse({})).toEqual({})
  })

  it("accepts documented optional query params", () => {
    expect(
      contactCreateUserQuerySchema.parse({
        user_id_type: "open_id",
        department_id_type: "open_department_id",
        client_token: "abcd-12345-e6f",
      }),
    ).toEqual({
      user_id_type: "open_id",
      department_id_type: "open_department_id",
      client_token: "abcd-12345-e6f",
    })
  })

  it("rejects unknown query keys (strict)", () => {
    expect(() => contactCreateUserQuerySchema.parse({ extra: "x" })).toThrow()
  })
})

describe("contactCreateUserBodySchema", () => {
  const minimal = {
    name: "张三",
    mobile: "13011111111",
    department_ids: ["od-4e6ac4d14bcd5071a37a39de902c7141"],
    employee_type: 1,
  }

  it("accepts minimal valid body per Feishu doc", () => {
    expect(contactCreateUserBodySchema.parse(minimal)).toMatchObject(minimal)
  })

  it("accepts body with optional fields and nested orders/custom_attrs", () => {
    const parsed = contactCreateUserBodySchema.parse({
      ...minimal,
      en_name: "San Zhang",
      orders: [
        {
          department_id: "od-4e6ac4d14bcd5071a37a39de902c7141",
          user_order: 100,
          department_order: 100,
          is_primary_dept: true,
        },
      ],
      custom_attrs: [
        {
          type: "TEXT",
          id: "DemoId",
          value: { text: "DemoText" },
        },
      ],
    })
    expect(parsed.orders).toHaveLength(1)
    expect(parsed.custom_attrs).toHaveLength(1)
  })

  it("rejects unknown top-level body keys (strict)", () => {
    expect(() =>
      contactCreateUserBodySchema.parse({
        ...minimal,
        not_in_doc: true,
      }),
    ).toThrow()
  })

  it("rejects body missing required fields", () => {
    expect(() =>
      contactCreateUserBodySchema.parse({
        name: "张三",
        mobile: "13011111111",
        employee_type: 1,
      }),
    ).toThrow()
  })
})
