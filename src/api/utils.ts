/**
 * Normalize an API response that may be a plain array or a wrapper object
 * like { data: [...] }, { success: true, data: [...] }, etc.
 */
export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}
