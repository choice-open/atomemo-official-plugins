import {
  PropertyDiscriminatedUnionSchema,
  PropertyObjectSchema,
} from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import {
  pagePropertiesProperty,
  propertiesValue,
} from "../src/tools/_shared-parameters/page-properties/page-properties";

describe("pagePropertiesProperty", () => {
  it("should be a valid PropertyObject according to PropertyObjectSchema", () => {
    const result = PropertyObjectSchema.safeParse(pagePropertiesProperty);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
  });
});

describe("propertiesValue", () => {
  it("should be a valid PropertyDiscriminatedUnion according to PropertyDiscriminatedUnionSchema", () => {
    const result = PropertyDiscriminatedUnionSchema.safeParse(propertiesValue);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
  });
});
