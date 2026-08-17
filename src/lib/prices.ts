// Server-safe price source of truth (in rupees). Keep in sync with src/lib/products.ts.
export const PRICES_INR: Record<string, number> = {
  handbook: 520,
};

export const totalInr = (ids: readonly string[]) =>
  ids.reduce((sum, id) => sum + (PRICES_INR[id] ?? 0), 0);
