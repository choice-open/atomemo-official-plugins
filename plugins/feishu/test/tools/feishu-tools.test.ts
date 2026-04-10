import { describe, expect, it } from "vitest"
import { approvalTools } from "../../src/tools/approval/tools"
import { calendarTools } from "../../src/tools/calendar/tools"
import { contactTools } from "../../src/tools/contact/tools"
import {
  extractPathParamKeys,
  replacePathParams,
} from "../../src/tools/feishu/request"
import { allFeishuTools } from "../../src/tools/feishu-tools"
import { imTools } from "../../src/tools/im/tools"
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

  it("should create standalone tools for all functions", () => {
    expect(allFeishuTools).toHaveLength(83)
    expect(contactTools).toHaveLength(23)
    expect(imTools).toHaveLength(13)
    expect(calendarTools).toHaveLength(24)
    expect(taskTools).toHaveLength(14)
    expect(approvalTools).toHaveLength(9)
    expect(allFeishuTools[0]?.name).toBe("feishu-contact_create_user")
    expect(allFeishuTools[82]?.name).toBe("feishu-approval_list_definitions")
  })

  it("should detect path params from both styles", () => {
    const keys = extractPathParamKeys(
      "/open-apis/im/v1/chats/:chat_id/members/{member_id}",
    )
    expect(keys).toEqual(["chat_id", "member_id"])
  })
})
