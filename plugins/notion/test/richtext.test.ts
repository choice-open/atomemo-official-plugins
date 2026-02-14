import {
  PropertyArraySchema,
  PropertyDiscriminatedUnionSchema,
  PropertyObjectSchema,
} from "@choiceopen/atomemo-plugin-schema/schemas"
import { describe, expect, it } from "vitest"
import {
  annotationParameter,
  mentionValueParameter,
  titleArrayParameter,
} from "../src/tools/_shared-parameters/page-properties/richtext"

describe("richtext parameters", () => {
  it("annotationParameter should be valid", () => {
    console.log(
      "annotationParameter:",
      JSON.stringify(annotationParameter, null, 2),
    )
    const result = PropertyObjectSchema.safeParse(annotationParameter)
    if (!result.success) {
      console.log(
        "annotationParameter validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      )
    }
    expect(result.success).toBe(true)
  })

  it("mentionValueParameter should be valid", () => {
    console.log(
      "mentionValueParameter:",
      JSON.stringify(mentionValueParameter, null, 2),
    )
    const result = PropertyDiscriminatedUnionSchema.safeParse(
      mentionValueParameter,
    )
    if (!result.success) {
      console.log(
        "mentionValueParameter validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      )
    }
    expect(result.success).toBe(true)
  })

  it("titleArrayParameter should be valid", () => {
    console.log(
      "titleArrayParameter:",
      JSON.stringify(titleArrayParameter, null, 2),
    )
    const result = PropertyArraySchema.safeParse(titleArrayParameter)
    if (!result.success) {
      console.log(
        "titleArrayParameter validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      )
    }
    expect(result.success).toBe(true)
  })
})
