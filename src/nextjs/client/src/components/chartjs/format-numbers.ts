export function formatAbbreviatedNumber(
  value: string | number,
  {
    currency,
    decimals = 1,
  }: {
    currency?: string
    decimals?: number
  } = {}
): string | number {
  const n = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(n)) return value

  const abs = Math.abs(n)

  let scaled = n
  let suffix = ''

  if (abs >= 1e12) {
    scaled = n / 1e12
    suffix = 'T'
  } else if (abs >= 1e9) {
    scaled = n / 1e9
    suffix = 'B'
  } else if (abs >= 1e6) {
    scaled = n / 1e6
    suffix = 'M'
  } else if (abs >= 1e3) {
    scaled = n / 1e3
    suffix = 'K'
  }

  const formatted = scaled.toFixed(decimals)

  return currency
    ? `${currency}${formatted}${suffix}`
    : `${formatted}${suffix}`
}
