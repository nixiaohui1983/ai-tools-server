/**
 * Safely extract a string value from req.query
 */
export function getQueryString(
  val: any
): string | undefined {
  if (!val) return undefined;
  if (Array.isArray(val)) return String(val[0]);
  return String(val);
}

/**
 * Safely extract a number value from req.query
 */
export function getQueryNumber(
  val: any,
  fallback: number
): number {
  const str = getQueryString(val);
  if (!str) return fallback;
  const num = Number(str);
  return isNaN(num) ? fallback : num;
}

/**
 * Safely extract a boolean value from req.query
 */
export function getQueryBoolean(
  val: any,
  fallback: boolean
): boolean {
  const str = getQueryString(val);
  if (!str) return fallback;
  return str !== 'false' && str !== '0';
}
