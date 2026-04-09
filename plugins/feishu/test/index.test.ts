import { describe, expect, it, vi } from "vitest"
import { createFeishuSdkTool } from "../src/tools/feishu-base"

describe("priority feishu sdk tools", () => {
  it("invokes fixed sdk method with parsed payload", async () => {
    const create = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: { create }, department: {} },
      im: { message: {}, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_contact_user_create",
        displayNameEn: "Feishu Contact User Create",
        displayNameZh: "飞书创建员工",
        descriptionEn: "Create employee",
        descriptionZh: "创建员工",
        invokeSdk: (client, payload) => client.contact.user.create(payload),
      },
      { clientFactory },
    )

    const result = await tool.invoke({
      args: {
        parameters: {
          credentialId: "cred-1",
          payload_json: '{"data":{"name":"test-user"}}',
        },
        credentials: {
          "cred-1": {
            app_id: "cli_xxx",
            app_secret: "sec_xxx",
          },
        },
      },
      context: {} as never,
    })

    expect(clientFactory).toHaveBeenCalledWith("cli_xxx", "sec_xxx")
    expect(create).toHaveBeenCalledWith({ data: { name: "test-user" } })
    expect(result).toMatchObject({
      tool: "feishu_contact_user_create",
    })
  })

  it("throws for invalid payload_json", async () => {
    const create = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: { create }, department: {} },
      im: { message: {}, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_contact_user_create",
        displayNameEn: "Feishu Contact User Create",
        displayNameZh: "飞书创建员工",
        descriptionEn: "Create employee",
        descriptionZh: "创建员工",
        invokeSdk: (client, payload) => client.contact.user.create(payload),
      },
      { clientFactory },
    )

    await expect(
      tool.invoke({
        args: {
          parameters: {
            credentialId: "cred-1",
            payload_json: "{bad-json}",
          },
          credentials: {
            "cred-1": {
              app_id: "cli_xxx",
              app_secret: "sec_xxx",
            },
          },
        },
        context: {} as never,
      }),
    ).rejects.toThrow("Invalid JSON for parameter `payload_json`")
  })

  it("maps structured fields to sdk payload", async () => {
    const create = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: {}, department: {} },
      im: { message: { create }, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_im_message_send",
        displayNameEn: "Feishu IM Message Send",
        displayNameZh: "飞书发送消息",
        descriptionEn: "Send message",
        descriptionZh: "发送消息",
        uiFields: [
          {
            name: "receive_id_type",
            displayNameEn: "Receive ID Type",
            displayNameZh: "接收者 ID 类型",
            target: "params",
            key: "receive_id_type",
            required: true,
          },
          {
            name: "receive_id",
            displayNameEn: "Receive ID",
            displayNameZh: "接收者 ID",
            target: "data",
            key: "receive_id",
            required: true,
          },
        ],
        invokeSdk: (client, payload) => client.im.message.create(payload),
      },
      { clientFactory },
    )

    await tool.invoke({
      args: {
        parameters: {
          credentialId: "cred-1",
          receive_id_type: "open_id",
          receive_id: "ou_xxx",
        },
        credentials: {
          "cred-1": {
            app_id: "cli_xxx",
            app_secret: "sec_xxx",
          },
        },
      },
      context: {} as never,
    })

    expect(create).toHaveBeenCalledWith({
      params: { receive_id_type: "open_id" },
      data: { receive_id: "ou_xxx" },
    })
  })

  it("parses json typed ui field into array", async () => {
    const batchGetId = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: { batchGetId }, department: {} },
      im: { message: {}, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_contact_user_search",
        displayNameEn: "Feishu Contact User Search",
        displayNameZh: "飞书搜索员工信息",
        descriptionEn: "Search users",
        descriptionZh: "搜索员工",
        uiFields: [
          {
            name: "emails_json",
            displayNameEn: "Emails(JSON Array)",
            displayNameZh: "邮箱数组(JSON)",
            target: "data",
            key: "emails",
            valueType: "json",
            required: true,
          },
        ],
        invokeSdk: (client, payload) => client.contact.user.batchGetId(payload),
      },
      { clientFactory },
    )

    await tool.invoke({
      args: {
        parameters: {
          credentialId: "cred-1",
          emails_json: '["u1@example.com","u2@example.com"]',
        },
        credentials: {
          "cred-1": {
            app_id: "cli_xxx",
            app_secret: "sec_xxx",
          },
        },
      },
      context: {} as never,
    })

    expect(batchGetId).toHaveBeenCalledWith({
      data: { emails: ["u1@example.com", "u2@example.com"] },
    })
  })

  it("parses number typed ui field into number", async () => {
    const list = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: { list }, department: {} },
      im: { message: {}, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_contact_user_list",
        displayNameEn: "Feishu Contact User List",
        displayNameZh: "飞书批量获取员工列表",
        descriptionEn: "List users",
        descriptionZh: "获取员工列表",
        uiFields: [
          {
            name: "page_size",
            displayNameEn: "Page Size",
            displayNameZh: "分页大小",
            target: "params",
            key: "page_size",
            valueType: "number",
          },
        ],
        invokeSdk: (client, payload) => client.contact.user.list(payload),
      },
      { clientFactory },
    )

    await tool.invoke({
      args: {
        parameters: {
          credentialId: "cred-1",
          page_size: "50",
        },
        credentials: {
          "cred-1": {
            app_id: "cli_xxx",
            app_secret: "sec_xxx",
          },
        },
      },
      context: {} as never,
    })

    expect(list).toHaveBeenCalledWith({
      params: { page_size: 50 },
    })
  })

  it("parses boolean typed ui field into boolean", async () => {
    const list = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: { list }, department: {} },
      im: { message: {}, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_contact_user_list",
        displayNameEn: "Feishu Contact User List",
        displayNameZh: "飞书批量获取员工列表",
        descriptionEn: "List users",
        descriptionZh: "获取员工列表",
        uiFields: [
          {
            name: "fetch_child",
            displayNameEn: "Fetch Child Departments",
            displayNameZh: "递归拉取子部门",
            target: "params",
            key: "fetch_child",
            valueType: "boolean",
          },
        ],
        invokeSdk: (client, payload) => client.contact.user.list(payload),
      },
      { clientFactory },
    )

    await tool.invoke({
      args: {
        parameters: {
          credentialId: "cred-1",
          fetch_child: "true",
        },
        credentials: {
          "cred-1": {
            app_id: "cli_xxx",
            app_secret: "sec_xxx",
          },
        },
      },
      context: {} as never,
    })

    expect(list).toHaveBeenCalledWith({
      params: { fetch_child: true },
    })
  })

  it("validates required nested payload fields before sdk invoke", async () => {
    const create = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: {}, department: {} },
      im: { message: { create }, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_im_message_send",
        displayNameEn: "Feishu IM Message Send",
        displayNameZh: "飞书发送消息",
        descriptionEn: "Send message",
        descriptionZh: "发送消息",
        validatePayload: (payload) => {
          const params = (payload.params as Record<string, unknown>) ?? {}
          if (!String(params.receive_id_type ?? "").trim()) {
            throw new Error(
              "VALIDATION_ERROR: Missing required field: params.receive_id_type",
            )
          }
        },
        invokeSdk: (client, payload) => client.im.message.create(payload),
      },
      { clientFactory },
    )

    await expect(
      tool.invoke({
        args: {
          parameters: {
            credentialId: "cred-1",
            data_json: '{"receive_id":"ou_xxx"}',
          },
          credentials: {
            "cred-1": {
              app_id: "cli_xxx",
              app_secret: "sec_xxx",
            },
          },
        },
        context: {} as never,
      }),
    ).rejects.toThrow(
      "VALIDATION_ERROR: Missing required field: params.receive_id_type",
    )
    expect(create).not.toHaveBeenCalled()
  })

  it("validates array requirements for batch/get style APIs", async () => {
    const batchGetId = vi.fn().mockResolvedValue({ code: 0, msg: "ok" })
    const clientFactory = vi.fn().mockReturnValue({
      contact: { user: { batchGetId }, department: {} },
      im: { message: {}, image: {}, file: {} },
      calendar: { calendar: {}, event: {} },
    })
    const tool = createFeishuSdkTool(
      {
        name: "feishu_contact_user_search",
        displayNameEn: "Feishu Contact User Search",
        displayNameZh: "飞书搜索员工信息",
        descriptionEn: "Search users",
        descriptionZh: "搜索员工",
        validatePayload: (payload) => {
          const data = (payload.data as Record<string, unknown>) ?? {}
          const emails = data.emails
          const mobiles = data.mobiles
          const ok =
            (Array.isArray(emails) && emails.length > 0) ||
            (Array.isArray(mobiles) && mobiles.length > 0)
          if (!ok) {
            throw new Error(
              "VALIDATION_ERROR: Missing required field: data.emails or mobiles",
            )
          }
        },
        invokeSdk: (client, payload) => client.contact.user.batchGetId(payload),
      },
      { clientFactory },
    )

    await expect(
      tool.invoke({
        args: {
          parameters: {
            credentialId: "cred-1",
          },
          credentials: {
            "cred-1": {
              app_id: "cli_xxx",
              app_secret: "sec_xxx",
            },
          },
        },
        context: {} as never,
      }),
    ).rejects.toThrow(
      "VALIDATION_ERROR: Missing required field: data.emails or mobiles",
    )
    expect(batchGetId).not.toHaveBeenCalled()
  })
})
