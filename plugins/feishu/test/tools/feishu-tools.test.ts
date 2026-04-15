import { describe, expect, it } from "vitest"
import { approvalTools } from "../../src/tools/approval/tools"
import { calendarTools } from "../../src/tools/calendar/tools"
import {
  extractPathParamKeys,
  replacePathParams,
} from "../../src/tools/feishu/request"
import { allFeishuTools } from "../../src/tools/feishu-tools"
import { imTools } from "../../src/tools/im/tools"
import { organizationTools } from "../../src/tools/organization"
import { taskTools } from "../../src/tools/task/tools"

describe("feishu path helpers", () => {
  it("should replace both :param and {param}", () => {
    const result = replacePathParams(
      "/open-apis/im/v1/chats/:chat_id/members/{member_id}",
      {
        chat_id: "oc_123",
        member_id: "ou_456",
      },
    )
    expect(result).toBe("/open-apis/im/v1/chats/oc_123/members/ou_456")
  })

  it("should throw when path params missing", () => {
    expect(() =>
      replacePathParams("/open-apis/im/v1/chats/:chat_id", {}),
    ).toThrow("Missing path parameter")
  })

  it("should aggregate tools in registration order", () => {
    expect(allFeishuTools).toEqual([
      ...approvalTools,
      ...organizationTools,
      ...imTools,
      ...calendarTools,
      ...taskTools,
    ])
  })

  it("should detect path params from both styles", () => {
    const keys = extractPathParamKeys(
      "/open-apis/im/v1/chats/:chat_id/members/{member_id}",
    )
    expect(keys).toEqual(["chat_id", "member_id"])
  })
})
