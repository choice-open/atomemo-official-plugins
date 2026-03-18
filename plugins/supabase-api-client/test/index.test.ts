import { describe, expect, it } from "vitest"
import { supabaseQueryTool } from "../src/tools/db/supabase-query"
import { supabaseInsertTool } from "../src/tools/db/supabase-insert"
import { supabaseDeleteTool } from "../src/tools/db/supabase-delete"
import { supabaseUpdateTool } from "../src/tools/db/supabase-update"
import { supabaseRpcTool } from "../src/tools/db/supabase-rpc"

describe("工具定义", () => {
  it("supabase-query 具有完整定义", () => {
    expect(supabaseQueryTool.name).toBe("supabase-query")
    expect(supabaseQueryTool.display_name).toBeDefined()
    expect(supabaseQueryTool.description).toBeDefined()
    expect(supabaseQueryTool.parameters).toBeDefined()
    expect(supabaseQueryTool.invoke).toBeInstanceOf(Function)
  })

  it("supabase-insert 具有完整定义", () => {
    expect(supabaseInsertTool.name).toBe("supabase-insert")
    expect(supabaseInsertTool.invoke).toBeInstanceOf(Function)
  })

  it("supabase-update 具有完整定义", () => {
    expect(supabaseUpdateTool.name).toBe("supabase-update")
    expect(supabaseUpdateTool.invoke).toBeInstanceOf(Function)
  })

  it("supabase-delete 具有完整定义", () => {
    expect(supabaseDeleteTool.name).toBe("supabase-delete")
    expect(supabaseDeleteTool.invoke).toBeInstanceOf(Function)
  })

  it("supabase-rpc 具有完整定义", () => {
    expect(supabaseRpcTool.name).toBe("supabase-rpc")
    expect(supabaseRpcTool.invoke).toBeInstanceOf(Function)
  })
})
