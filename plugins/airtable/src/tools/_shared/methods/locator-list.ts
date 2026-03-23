import { getBaseSchema, listBases, searchRecords } from "../../../api/client"
import { t } from "../../../i18n/i18n-node"
import { resolveBaseId, resolveTable } from "../resolve"
import { getAirtableToken } from "../utils"

type LocatorCtx = {
  credentials: Record<string, unknown>
  filter?: string | null
  parameters: Record<string, unknown>
}

function matchesFilter(
  values: Array<string | undefined>,
  filter?: string | null,
): boolean {
  const normalized = filter?.trim().toLowerCase()
  if (!normalized) return true
  return values.some((v) => v?.toLowerCase().includes(normalized))
}

export const searchBasesMethod = {
  async search_bases({ credentials, filter, parameters }: LocatorCtx) {
    const token = getAirtableToken({ credentials, parameters })
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const bases = await listBases(token, { returnAll: true })
    const results = bases
      .filter((base) => matchesFilter([base.name, base.id], filter))
      .map((base) => ({
        label: base.name,
        value: base.id,
        url: `https://airtable.com/${base.id}`,
      }))

    return { results }
  },
}

export const searchTablesMethod = {
  async search_tables({ credentials, filter, parameters }: LocatorCtx) {
    const token = getAirtableToken({ credentials, parameters })
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const baseId = resolveBaseId(parameters)
    if (!baseId) return { results: [] }

    const tables = await getBaseSchema(token, baseId)
    const results = tables
      .filter((table) => matchesFilter([table.name, table.id], filter))
      .map((table) => ({
        label: table.name,
        value: table.name,
        url: `https://airtable.com/${baseId}/${table.id}`,
      }))

    return { results }
  },
}

export const searchRecordsMethod = {
  async search_records({ credentials, filter, parameters }: LocatorCtx) {
    const token = getAirtableToken({ credentials, parameters })
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const baseId = resolveBaseId(parameters)
    const table = resolveTable(parameters)
    if (!baseId || !table) return { results: [] }

    const records = await searchRecords(token, baseId, table, { returnAll: true })
    const results = records
      .filter((r) => {
        if (!filter) return true
        const name = String(r.fields.Name ?? r.id).toLowerCase()
        return name.includes(filter.trim().toLowerCase())
      })
      .map((r) => ({
        label: String(r.fields.Name ?? r.id),
        value: r.id,
      }))

    return { results }
  },
}
