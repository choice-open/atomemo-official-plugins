const AIRTABLE_BASE_URL = "https://api.airtable.com/v0";

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

export interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

export interface AirtableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: unknown;
}

export interface AirtableTable {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: AirtableField[];
  views?: unknown[];
}

async function request<T>(
  token: string,
  method: string,
  path: string,
  options: {
    body?: unknown;
    query?: Record<string, unknown>;
  } = {},
): Promise<T> {
  const url = new URL(`${AIRTABLE_BASE_URL}/${path}`);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = { method, headers };
  if (options.body !== undefined) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    let errorType: string | undefined;
    let errorMessage = `Airtable API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = (await response.json()) as {
        error?: { type?: string; message?: string };
      };
      errorMessage = errorBody.error?.message ?? errorMessage;
      errorType = errorBody.error?.type;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(
      errorType ? `${errorMessage} (type: ${errorType})` : errorMessage,
    );
  }

  return response.json() as Promise<T>;
}

// ── Bases ──────────────────────────────────────────────────────────────────

export async function listBases(
  token: string,
  options: {
    returnAll?: boolean;
    limit?: number;
    permissionLevel?: string[];
  } = {},
): Promise<AirtableBase[]> {
  const bases: AirtableBase[] = [];
  let offset: string | undefined;

  do {
    const query: Record<string, unknown> = {};
    if (offset) query.offset = offset;

    const data = await request<{ bases: AirtableBase[]; offset?: string }>(
      token,
      "GET",
      "meta/bases",
      { query },
    );

    bases.push(...(data.bases ?? []));
    offset = data.offset;

    if (!options.returnAll) break;
  } while (offset);

  let result = bases;

  if (options.permissionLevel && options.permissionLevel.length > 0) {
    result = result.filter((b) =>
      options.permissionLevel!.includes(b.permissionLevel),
    );
  }

  if (!options.returnAll && options.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
}

export async function getBaseSchema(
  token: string,
  baseId: string,
): Promise<AirtableTable[]> {
  const data = await request<{ tables: AirtableTable[] }>(
    token,
    "GET",
    `meta/bases/${baseId}/tables`,
  );
  return data.tables ?? [];
}

// ── Records ────────────────────────────────────────────────────────────────

export async function createRecord(
  token: string,
  baseId: string,
  table: string,
  fields: Record<string, unknown>,
  typecast = false,
): Promise<AirtableRecord> {
  return request<AirtableRecord>(token, "POST", `${baseId}/${table}`, {
    body: { fields, typecast },
  });
}

export async function getRecord(
  token: string,
  baseId: string,
  table: string,
  recordId: string,
): Promise<AirtableRecord> {
  return request<AirtableRecord>(
    token,
    "GET",
    `${baseId}/${table}/${recordId}`,
  );
}

export interface SearchOptions {
  filterByFormula?: string;
  returnAll?: boolean;
  limit?: number;
  sort?: Array<{ field: string; direction?: "asc" | "desc" }>;
  view?: string;
  fields?: string[];
}

export async function searchRecords(
  token: string,
  baseId: string,
  table: string,
  options: SearchOptions = {},
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const query: Record<string, unknown> = {};

    if (offset) query.offset = offset;
    if (options.filterByFormula)
      query.filterByFormula = options.filterByFormula;
    if (options.view) query.view = options.view;
    if (options.fields && options.fields.length > 0) {
      query["fields[]"] = options.fields;
    }

    if (options.sort && options.sort.length > 0) {
      options.sort.forEach((s, i) => {
        query[`sort[${i}][field]`] = s.field;
        query[`sort[${i}][direction]`] = s.direction ?? "asc";
      });
    }

    if (options.returnAll) {
      query.pageSize = 100;
    } else {
      query.maxRecords = options.limit ?? 100;
    }

    const data = await request<{
      records: AirtableRecord[];
      offset?: string;
    }>(token, "GET", `${baseId}/${table}`, { query });

    records.push(...(data.records ?? []));
    offset = data.offset;

    if (!options.returnAll) break;
  } while (offset);

  return records;
}

export async function updateRecord(
  token: string,
  baseId: string,
  table: string,
  recordId: string,
  fields: Record<string, unknown>,
  typecast = false,
): Promise<AirtableRecord> {
  return request<AirtableRecord>(
    token,
    "PATCH",
    `${baseId}/${table}/${recordId}`,
    { body: { fields, typecast } },
  );
}

export interface UpsertOptions {
  fieldsToMergeOn: string[];
  typecast?: boolean;
  updateAllMatches?: boolean;
}

export interface UpsertResult {
  records: AirtableRecord[];
  createdRecords: string[];
  updatedRecords: string[];
}

export async function upsertRecord(
  token: string,
  baseId: string,
  table: string,
  fields: Record<string, unknown>,
  options: UpsertOptions,
): Promise<UpsertResult> {
  const endpoint = `${baseId}/${table}`;
  const performUpsert: Record<string, unknown> = {
    fieldsToMergeOn: options.fieldsToMergeOn,
  };
  if (options.updateAllMatches) {
    performUpsert.updateAllMatches = true;
  }
  const body: Record<string, unknown> = {
    typecast: options.typecast ?? false,
    performUpsert,
    records: [{ fields }],
  };

  const data = await request<UpsertResult>(token, "PATCH", endpoint, {
    body,
  });
  return data;
}

export async function deleteRecord(
  token: string,
  baseId: string,
  table: string,
  recordId: string,
): Promise<{ id: string; deleted: boolean }> {
  return request<{ id: string; deleted: boolean }>(
    token,
    "DELETE",
    `${baseId}/${table}/${recordId}`,
  );
}
