import { prettifyError, z } from "zod"
import { parseParameters } from "./parse-zod"

/** Google Sheets API `majorDimension` (values.get / batchGet). */
export const majorDimensionSchema = z.enum(["ROWS", "COLUMNS"])

/** Google Sheets API `valueRenderOption`. */
export const valueRenderOptionSchema = z.enum([
  "FORMATTED_VALUE",
  "UNFORMATTED_VALUE",
  "FORMULA",
])

/** Google Sheets API `valueInputOption` (values.update / append). */
export const valueInputOptionSchema = z.enum(["RAW", "USER_ENTERED"])

/** Google Sheets API `insertDataOption` (values.append). */
export const insertDataOptionSchema = z.enum(["OVERWRITE", "INSERT_ROWS"])

const nonEmptyTrimmedString = z.string().trim().min(1, "Must not be empty")

function emptyToUndefined(val: unknown): unknown {
  if (val === undefined || val === null) return undefined
  if (typeof val === "string" && val.trim() === "") return undefined
  return val
}

const optionalMajorDimension = z.preprocess(
  emptyToUndefined,
  majorDimensionSchema.optional(),
)

const optionalValueRenderOption = z.preprocess(
  emptyToUndefined,
  valueRenderOptionSchema.optional(),
)

const optionalValueInputOption = z.preprocess(
  emptyToUndefined,
  valueInputOptionSchema.optional(),
)

const optionalInsertDataOption = z.preprocess(
  emptyToUndefined,
  insertDataOptionSchema.optional(),
)

/** Parses `values` / `ValueRange.values`: JSON string or 2D array (Sheets API). */
export function parseValues2d(raw: unknown, fieldName = "values"): unknown[][] {
  let parsed: unknown
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error(
        `Invalid JSON for ${fieldName}. Expected a 2D array like [["a","b"],["c","d"]].`,
      )
    }
  } else {
    parsed = raw
  }

  const rowSchema = z.array(z.unknown())
  const result = z
    .array(rowSchema)
    .min(1, `${fieldName} must be a non-empty 2D array`)
    .refine((rows) => rows.every((row) => Array.isArray(row)), {
      message: `${fieldName}: each row must be an array (Sheets ValueRange.values)`,
    })
    .safeParse(parsed)

  if (!result.success) {
    throw new Error(`${fieldName}: ${prettifyError(result.error)}`)
  }
  return result.data
}

const rangesListFromString = z
  .string()
  .trim()
  .min(1, "ranges must not be empty")
  .transform((s) =>
    s
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean),
  )
  .refine((arr) => arr.length > 0, {
    message: "At least one A1 range is required (comma-separated)",
  })

const readRowsInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    range: nonEmptyTrimmedString,
    major_dimension: optionalMajorDimension,
    value_render_option: optionalValueRenderOption,
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    range: o.range,
    majorDimension: o.major_dimension ?? "ROWS",
    valueRenderOption: o.value_render_option ?? "FORMATTED_VALUE",
  }))

export function parseReadRowsParams(raw: Record<string, unknown>) {
  return parseParameters(readRowsInputSchema, raw)
}

const batchGetInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    ranges: rangesListFromString,
    major_dimension: optionalMajorDimension,
    value_render_option: optionalValueRenderOption,
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    ranges: o.ranges,
    majorDimension: o.major_dimension ?? "ROWS",
    valueRenderOption: o.value_render_option ?? "FORMATTED_VALUE",
  }))

export function parseBatchGetValuesParams(raw: Record<string, unknown>) {
  return parseParameters(batchGetInputSchema, raw)
}

const updateRowsInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    range: nonEmptyTrimmedString,
    value_input_option: optionalValueInputOption,
    values: z.unknown(),
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    range: o.range,
    valueInputOption: o.value_input_option ?? "USER_ENTERED",
    values: parseValues2d(o.values, "values"),
  }))

export function parseUpdateRowsParams(raw: Record<string, unknown>) {
  return parseParameters(updateRowsInputSchema, raw)
}

const appendRowsInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    range: nonEmptyTrimmedString,
    value_input_option: optionalValueInputOption,
    insert_data_option: optionalInsertDataOption,
    values: z.unknown(),
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    range: o.range,
    valueInputOption: o.value_input_option ?? "USER_ENTERED",
    insertDataOption: o.insert_data_option ?? "INSERT_ROWS",
    values: parseValues2d(o.values, "values"),
  }))

export function parseAppendRowsParams(raw: Record<string, unknown>) {
  return parseParameters(appendRowsInputSchema, raw)
}

const clearValuesInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    range: nonEmptyTrimmedString,
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    range: o.range,
  }))

export function parseClearValuesParams(raw: Record<string, unknown>) {
  return parseParameters(clearValuesInputSchema, raw)
}

const copySheetInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    sheet_id: z.coerce.number().int().finite(),
    destination_spreadsheet_id: nonEmptyTrimmedString,
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    sheetId: o.sheet_id,
    destinationSpreadsheetId: o.destination_spreadsheet_id,
  }))

export function parseCopySheetParams(raw: Record<string, unknown>) {
  return parseParameters(copySheetInputSchema, raw)
}

const sheetTitlesFromOptionalString = z.preprocess((val) => {
  if (val === undefined || val === null) return undefined
  if (typeof val === "string" && val.trim() === "") return undefined
  return val
}, z.string().trim().optional())

const createSpreadsheetInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    title: nonEmptyTrimmedString,
    sheet_titles: sheetTitlesFromOptionalString,
  })
  .transform((o) => {
    const sheetTitlesRaw = o.sheet_titles
    const sheetsList =
      sheetTitlesRaw !== undefined
        ? sheetTitlesRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    return {
      requestBody: {
        properties: { title: o.title },
        ...(sheetsList.length > 0
          ? {
              sheets: sheetsList.map((sheetTitle, index) => ({
                properties: { title: sheetTitle, index },
              })),
            }
          : {}),
      },
    }
  })

export function parseCreateSpreadsheetParams(raw: Record<string, unknown>) {
  return parseParameters(createSpreadsheetInputSchema, raw)
}

const getSpreadsheetInfoInputSchema = z
  .object({
    credential_id: nonEmptyTrimmedString,
    spreadsheet_id: nonEmptyTrimmedString,
    include_grid_data: z.boolean().optional(),
  })
  .transform((o) => ({
    spreadsheetId: o.spreadsheet_id,
    includeGridData: o.include_grid_data === true,
  }))

export function parseGetSpreadsheetInfoParams(raw: Record<string, unknown>) {
  return parseParameters(getSpreadsheetInfoInputSchema, raw)
}
