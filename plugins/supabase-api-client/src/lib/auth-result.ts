/** Normalize Supabase Auth { data, error } to plugin invoke result format */
export function authResult<T>(
  result: {
    data: T | null
    error: { message?: string; code?: string; status?: number } | null
  }
): {
  success: boolean
  data: T | null
  error: string | null
  code: string | null
} {
  if (result.error) {
    return {
      success: false,
      data: null,
      error: result.error.message ?? String(result.error.status ?? "Unknown error"),
      code: result.error.code ?? null,
    }
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
