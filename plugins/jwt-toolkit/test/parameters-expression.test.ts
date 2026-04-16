import { describe, expect, it } from "vitest"
import { jwtDecodeTool } from "../src/tools/jwt-decode"
import { jwtSignTool } from "../src/tools/jwt-sign"
import { jwtVerifyTool } from "../src/tools/jwt-verify"

type ToolParameter = {
  name?: string
  type?: string
  ui?: {
    component?: string
    support_expression?: boolean
  }
}

function requiresExpressionSupport(param: ToolParameter): boolean {
  const component = param.ui?.component
  if (param.type === "credential_id") {
    return false
  }
  if (component === "credential-select") {
    return false
  }
  if (component === "encrypted-input") {
    return false
  }
  return true
}

describe("jwt-toolkit expression support metadata", () => {
  it("enables expressions on all non-credential-like tool parameters", () => {
    const tools = [jwtSignTool, jwtVerifyTool, jwtDecodeTool]

    for (const tool of tools) {
      for (const parameter of tool.parameters ?? []) {
        const param = parameter as ToolParameter
        if (!requiresExpressionSupport(param)) {
          continue
        }

        expect(param.ui?.support_expression).toBe(true)
      }
    }
  })

  it("keeps jwt_credential as credential selector", () => {
    const credentialParam = jwtSignTool.parameters?.find(
      (param) => param.name === "jwt_credential",
    ) as ToolParameter | undefined

    expect(credentialParam?.ui?.component).toBe("credential-select")
    expect(credentialParam?.ui?.support_expression).toBeUndefined()
  })
})
