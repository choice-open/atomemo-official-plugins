import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { hubspotOAuth2Credential } from "./credentials/hubspot-oauth2"
import { hubspotPrivateAppTokenCredential } from "./credentials/hubspot-private-app-token"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import {
  // CRM > Lists
  addContactToListTool,
  // Automation > Workflows
  addContactToWorkflowTool,
  // CRM > Associations
  createAssociationsTool,
  // CMS > Blog
  createBlogPostTool,
  // CRM > Companies
  createCompanyTool,
  // CRM > Contacts
  createContactTool,
  // CRM > Objects (Generic)
  createCrmObjectTool,
  // CRM > Deals
  createDealTool,
  // CRM > Engagements
  createEngagementTool,
  // Events
  createEnterpriseEventTool,
  // Marketing > Forms
  createFormSubmissionTool,
  // CRM > Line Items
  createLineItemTool,
  createListTool,
  // CRM > Products
  createProductTool,
  // Marketing > Social
  createSocialMessageTool,
  // CRM > Tickets
  createTicketTool,
  deleteCrmObjectTool,
  findAssociationsTool,
  findCompanyTool,
  findContactTool,
  findCrmObjectTool,
  findDealTool,
  findLineItemTool,
  findProductTool,
  findTicketTool,
  getCompanyTool,
  getContactTool,
  getCrmObjectTool,
  getDealTool,
  // Files
  getFilePublicUrlTool,
  getLineItemTool,
  // CRM > Owners
  getOwnerByEmailTool,
  getOwnerByIdTool,
  // CRM > Pipelines
  getPipelineStageDetailsTool,
  getProductTool,
  getTicketTool,
  removeAssociationsTool,
  removeContactFromListTool,
  // Marketing > Email Subscriptions
  removeEmailSubscriptionTool,
  updateCompanyTool,
  updateContactTool,
  updateCrmObjectTool,
  updateDealTool,
  updateLineItemTool,
  updateProductTool,
  updateSubscriptionPreferencesTool,
  updateTicketTool,
  uploadFileTool,
} from "./tools"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "https://cdn.worldvectorlogo.com/logos/hubspot-1.svg",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/hubspot",
  locales,
  transporterOptions: {},
})

// ── Credentials ─────────────────────────────────────────────────────
plugin.addCredential(hubspotPrivateAppTokenCredential)
plugin.addCredential(hubspotOAuth2Credential)

// ── CRM > Contacts ──────────────────────────────────────────────────
plugin.addTool(createContactTool)
plugin.addTool(getContactTool)
plugin.addTool(updateContactTool)
plugin.addTool(findContactTool)

// ── CRM > Companies ─────────────────────────────────────────────────
plugin.addTool(createCompanyTool)
plugin.addTool(getCompanyTool)
plugin.addTool(updateCompanyTool)
plugin.addTool(findCompanyTool)

// ── CRM > Deals ─────────────────────────────────────────────────────
plugin.addTool(createDealTool)
plugin.addTool(getDealTool)
plugin.addTool(updateDealTool)
plugin.addTool(findDealTool)

// ── CRM > Tickets ───────────────────────────────────────────────────
plugin.addTool(createTicketTool)
plugin.addTool(getTicketTool)
plugin.addTool(updateTicketTool)
plugin.addTool(findTicketTool)

// ── CRM > Line Items ────────────────────────────────────────────────
plugin.addTool(createLineItemTool)
plugin.addTool(getLineItemTool)
plugin.addTool(updateLineItemTool)
plugin.addTool(findLineItemTool)

// ── CRM > Products ──────────────────────────────────────────────────
plugin.addTool(createProductTool)
plugin.addTool(getProductTool)
plugin.addTool(updateProductTool)
plugin.addTool(findProductTool)

// ── CRM > Objects (Generic) ────────────────────────────────────────
plugin.addTool(createCrmObjectTool)
plugin.addTool(getCrmObjectTool)
plugin.addTool(updateCrmObjectTool)
plugin.addTool(deleteCrmObjectTool)
plugin.addTool(findCrmObjectTool)

// ── CRM > Associations ─────────────────────────────────────────────
plugin.addTool(createAssociationsTool)
plugin.addTool(removeAssociationsTool)
plugin.addTool(findAssociationsTool)

// ── CRM > Owners ────────────────────────────────────────────────────
plugin.addTool(getOwnerByEmailTool)
plugin.addTool(getOwnerByIdTool)

// ── CRM > Pipelines ────────────────────────────────────────────────
plugin.addTool(getPipelineStageDetailsTool)

// ── CRM > Lists (Segments) ─────────────────────────────────────────
plugin.addTool(createListTool)
plugin.addTool(addContactToListTool)
plugin.addTool(removeContactFromListTool)

// ── CRM > Engagements ──────────────────────────────────────────────
plugin.addTool(createEngagementTool)

// ── Marketing > Forms ───────────────────────────────────────────────
plugin.addTool(createFormSubmissionTool)

// ── Marketing > Email Subscriptions ─────────────────────────────────
plugin.addTool(removeEmailSubscriptionTool)
plugin.addTool(updateSubscriptionPreferencesTool)

// ── Marketing > Social ──────────────────────────────────────────────
plugin.addTool(createSocialMessageTool)

// ── Automation > Workflows ──────────────────────────────────────────
plugin.addTool(addContactToWorkflowTool)

// ── CMS > Blog ──────────────────────────────────────────────────────
plugin.addTool(createBlogPostTool)

// ── Events ──────────────────────────────────────────────────────────
plugin.addTool(createEnterpriseEventTool)

// ── Files ───────────────────────────────────────────────────────────
plugin.addTool(getFilePublicUrlTool)
plugin.addTool(uploadFileTool)

plugin.run()
