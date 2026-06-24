export function serializeDates<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(serializeDates) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        v instanceof Date ? v.toISOString() : v,
      ])
    ) as T;
  }
  return obj;
}

export function stripNulls(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null)
  );
}
