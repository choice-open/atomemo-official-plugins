import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

const { getHubSpotClientMock } = vi.hoisted(() => ({
  getHubSpotClientMock: vi.fn(),
}))

vi.mock("../../src/tools/_shared/utils", async () => {
  const actual = await vi.importActual<typeof import("../../src/tools/_shared/utils")>(
    "../../src/tools/_shared/utils",
  )

  return {
    ...actual,
    getHubSpotClient: getHubSpotClientMock,
  }
})

import { addContactToWorkflowTool } from "../../src/tools/automation/workflows/add-contact-to-workflow"
import { getCompanyTool } from "../../src/tools/crm/companies/get-company"
import { createCrmObjectTool } from "../../src/tools/crm/objects/create-crm-object"
import { updateCrmObjectTool } from "../../src/tools/crm/objects/update-crm-object"
import { addContactToListTool } from "../../src/tools/crm/lists/add-contact-to-list"
import { createEnterpriseEventTool } from "../../src/tools/events/create-enterprise-event"
import { uploadFileTool } from "../../src/tools/files/upload-file"
import { updateSubscriptionPreferencesTool } from "../../src/tools/marketing/email-subscriptions/update-subscription-preferences"
import { createFormSubmissionTool } from "../../src/tools/marketing/forms/create-form-submission"
import { hubspotLocatorListMethods } from "../../src/tools/_shared/methods"
import {
  getResourceLocatorValue,
  resolveResourceMapper,
} from "../../src/tools/_shared/utils"

describe("HubSpot tool parameter migrations", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("keeps generic CRM object property mappers dependent on object_type", () => {
    const createPropertiesParam = createCrmObjectTool.parameters.find(
      (param) => param.name === "properties",
    )
    const updatePropertiesParam = updateCrmObjectTool.parameters.find(
      (param) => param.name === "properties",
    )

    expect(createPropertiesParam?.type).toBe("resource_mapper")
    expect(createPropertiesParam).toMatchObject({
      depends_on: ["object_type"],
    })
    expect(updatePropertiesParam?.type).toBe("resource_mapper")
    expect(updatePropertiesParam).toMatchObject({
      depends_on: ["object_type"],
    })
  })

  it("passes tag-input arrays through unchanged for get-company", async () => {
    const getByIdMock = vi.fn().mockResolvedValue({ id: "123" })
    getHubSpotClientMock.mockReturnValue({
      crm: {
        companies: {
          basicApi: {
            getById: getByIdMock,
          },
        },
      },
    })

    await getCompanyTool.invoke({
      args: {
        parameters: {
          object_id: "123",
          return_properties: ["firstname", "lastname"],
          return_associations: ["contacts", "deals"],
        },
      },
    } as never)

    expect(getByIdMock).toHaveBeenCalledWith(
      "123",
      ["firstname", "lastname"],
      undefined,
      ["contacts", "deals"],
    )
  })

  it("resolves resource_locator and array inputs for list membership updates", async () => {
    const addMock = vi.fn().mockResolvedValue({ ok: true })
    getHubSpotClientMock.mockReturnValue({
      crm: {
        lists: {
          membershipsApi: {
            add: addMock,
          },
        },
      },
    })

    await addContactToListTool.invoke({
      args: {
        parameters: {
          list_id: {
            __type__: "resource_locator",
            mode_name: "list",
            value: "list-123",
          },
          contact_ids: ["1", "2", "3"],
        },
      },
    } as never)

    expect(addMock).toHaveBeenCalledWith("list-123", ["1", "2", "3"])
  })

  it("resolves workflow resource locators before enrollment", async () => {
    const apiRequestMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true }),
    })
    getHubSpotClientMock.mockReturnValue({
      apiRequest: apiRequestMock,
    })

    await addContactToWorkflowTool.invoke({
      args: {
        parameters: {
          workflow_id: {
            __type__: "resource_locator",
            mode_name: "id",
            value: "workflow-123",
          },
          contact_email: "contact@example.com",
        },
      },
    } as never)

    expect(apiRequestMock).toHaveBeenCalledWith({
      method: "POST",
      path: "/automation/v4/flows/workflow-123/enrollments",
      body: { email: "contact@example.com" },
    })
  })

  it("uses the SDK locator extractor while preserving plain string fallback", () => {
    expect(
      getResourceLocatorValue(
        {
          workflow_id: {
            __type__: "resource_locator",
            mode_name: "id",
            value: "workflow-123",
          },
        },
        "workflow_id",
      ),
    ).toBe("workflow-123")

    expect(
      getResourceLocatorValue(
        {
          workflow_id: " workflow-456 ",
        },
        "workflow_id",
      ),
    ).toBe("workflow-456")
  })

  it("preserves number and boolean values from resource mapper payloads", () => {
    expect(
      resolveResourceMapper(
        {
          properties: {
            __type__: "resource_mapper",
            mapping_mode: "manual",
            value: {
              firstname: "Ada",
              seats: 3,
              marketing_opt_in: true,
            },
          },
        },
        "properties",
      ),
    ).toEqual({
      firstname: "Ada",
      seats: 3,
      marketing_opt_in: true,
    })

    expect(
      resolveResourceMapper(
        {
          properties: {
            __type__: "resource_mapper",
            mapping_mode: "auto",
            value: "{\"plan\":\"pro\",\"active\":true,\"quota\":10}",
          },
        },
        "properties",
      ),
    ).toEqual({
      plan: "pro",
      active: true,
      quota: 10,
    })
  })

  it("converts structured form field rows into HubSpot field payloads", async () => {
    const apiRequestMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true }),
    })
    getHubSpotClientMock.mockReturnValue({
      apiRequest: apiRequestMock,
    })

    await createFormSubmissionTool.invoke({
      args: {
        parameters: {
          portal_id: "123",
          form_guid: "form-guid",
          fields: [
            { key: "email", value: "person@example.com" },
            { key: "firstname", value: "Ada" },
          ],
        },
      },
    } as never)

    expect(apiRequestMock).toHaveBeenCalledWith({
      method: "POST",
      path: "/submissions/v3/integration/secure/submit/123/form-guid",
      body: {
        fields: [
          { name: "email", value: "person@example.com" },
          { name: "firstname", value: "Ada" },
        ],
      },
    })
  })

  it("converts structured enterprise event properties into an object map", async () => {
    const apiRequestMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true }),
    })
    getHubSpotClientMock.mockReturnValue({
      apiRequest: apiRequestMock,
    })

    await createEnterpriseEventTool.invoke({
      args: {
        parameters: {
          event_name: "pe123_event",
          email: "person@example.com",
          properties: [
            { key: "plan", value: "pro" },
            { key: "source", value: "campaign" },
          ],
        },
      },
    } as never)

    expect(apiRequestMock).toHaveBeenCalledWith({
      method: "POST",
      path: "/events/v3/send",
      body: {
        eventName: "pe123_event",
        email: "person@example.com",
        properties: {
          plan: "pro",
          source: "campaign",
        },
      },
    })
  })

  it("uses structured subscription status rows for subscribe and unsubscribe calls", async () => {
    const subscribeMock = vi.fn().mockResolvedValue({ ok: true })
    const unsubscribeMock = vi.fn().mockResolvedValue({ ok: true })
    getHubSpotClientMock.mockReturnValue({
      communicationPreferences: {
        statusApi: {
          subscribe: subscribeMock,
          unsubscribe: unsubscribeMock,
        },
      },
    })

    await updateSubscriptionPreferencesTool.invoke({
      args: {
        parameters: {
          email_address: "person@example.com",
          subscription_statuses: [
            { id: "101", subscribed: true },
            { id: "202", subscribed: false },
          ],
          legal_basis: "CONSENT_WITH_NOTICE",
          legal_basis_explanation: "User opted in",
        },
      },
    } as never)

    expect(subscribeMock).toHaveBeenCalledWith({
      emailAddress: "person@example.com",
      subscriptionId: "101",
      legalBasis: "CONSENT_WITH_NOTICE",
      legalBasisExplanation: "User opted in",
    })
    expect(unsubscribeMock).toHaveBeenCalledWith({
      emailAddress: "person@example.com",
      subscriptionId: "202",
      legalBasis: "CONSENT_WITH_NOTICE",
      legalBasisExplanation: "User opted in",
    })
  })

  it("uploads file_ref content and resolves folder locators", async () => {
    const uploadMock = vi.fn().mockResolvedValue({ id: "file-123" })
    getHubSpotClientMock.mockReturnValue({
      files: {
        filesApi: {
          upload: uploadMock,
        },
      },
    })

    const parseFileRefMock = vi.fn().mockReturnValue({
      __type__: "file_ref",
      filename: "report.pdf",
      mime_type: "application/pdf",
      content: null,
    })
    const downloadMock = vi.fn().mockResolvedValue({
      filename: "report.pdf",
      content: Buffer.from("hello world").toString("base64"),
    })

    await uploadFileTool.invoke({
      args: {
        parameters: {
          file_name: "report.pdf",
          file_content: {
            __type__: "file_ref",
            filename: "report.pdf",
          },
          folder_id: {
            __type__: "resource_locator",
            mode_name: "list",
            value: "folder-456",
          },
          access: "PRIVATE",
        },
      },
      context: {
        files: {
          parseFileRef: parseFileRefMock,
          download: downloadMock,
        },
      },
    } as never)

    expect(parseFileRefMock).toHaveBeenCalledWith({
      __type__: "file_ref",
      filename: "report.pdf",
    })
    expect(downloadMock).toHaveBeenCalledOnce()
    expect(uploadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "report.pdf",
      }),
      "folder-456",
      undefined,
      "report.pdf",
      undefined,
      expect.stringContaining('"access":"PRIVATE"'),
    )
  })

  it("searches lists through the shared locator_list helper", async () => {
    const apiRequestMock = vi.fn().mockResolvedValue({
      json: async () => ({
        hasMore: true,
        offset: 50,
        lists: [
          {
            listId: "100",
            name: "North America Contacts",
            objectTypeId: "0-1",
          },
        ],
      }),
    })
    getHubSpotClientMock.mockReturnValue({
      apiRequest: apiRequestMock,
    })

    const result = await hubspotLocatorListMethods.search_lists({
      parameters: {
        hubspot_oauth2_credential: "cred-1",
      },
      credentials: {
        "cred-1": {
          access_token: "token",
        },
      },
      filter: "North",
      pagination_token: "0",
    })

    expect(apiRequestMock).toHaveBeenCalledWith({
      method: "POST",
      path: "/crm/v3/lists/search",
      body: {
        count: 50,
        offset: 0,
        query: "North",
      },
    })
    expect(result).toEqual({
      results: [
        {
          label: "North America Contacts (100)",
          value: "100",
          url: null,
        },
      ],
      pagination_token: "50",
    })
  })
})
