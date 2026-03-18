/** Normalize Supabase Auth { data, error } to plugin invoke result format */
export function authResult<T>(result: {
  data: T | null
  error: { message?: string; code?: string; status?: number } | null
}): {
  success: true
  data: T | null
  error: null
  code: string | null
} {
  if (result.error) {
    const message =
      result.error.message ?? String(result.error.status ?? "Unknown error")
    const e: any = new Error(message)
    e.code = result.error.code ?? null
    throw e
  }
  return {
    success: true,
    data: result.data as T | null,
    error: null,
    code: null,
  }
}

export function parseJson<T>(input: string | undefined, fallback: T): T {
  if (input == null || input === "") return fallback
  try {
    return JSON.parse(input) as T
  } catch {
    return fallback
  }
}
