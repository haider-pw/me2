const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Parses a "YYYY-MM" string into [year, monthIndex]. */
function parseYearMonth(value: string): [number, number] {
  const [y, m] = value.split('-').map(Number)
  return [y ?? 0, (m ?? 1) - 1]
}

function currentYearMonth(): [number, number] {
  const now = new Date()
  return [now.getFullYear(), now.getMonth()]
}

/** "2020-06" → "Jun 2020" */
export function formatYearMonth(value: string): string {
  const [y, m] = parseYearMonth(value)
  return `${MONTHS[m]} ${y}`
}

/** "2020-06", null → "Jun 2020 — Present" */
export function formatPeriod(start: string, end: string | null): string {
  return `${formatYearMonth(start)} — ${end ? formatYearMonth(end) : 'Present'}`
}

/** Total months between two "YYYY-MM" values (inclusive of the start month). */
export function monthsBetween(start: string, end: string | null): number {
  const [sy, sm] = parseYearMonth(start)
  const [ey, em] = end ? parseYearMonth(end) : currentYearMonth()
  return Math.max(1, (ey - sy) * 12 + (em - sm) + 1)
}

/** "2020-06", null → "6 yrs 4 mos" */
export function formatDuration(start: string, end: string | null): string {
  const total = monthsBetween(start, end)
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`)
  return parts.join(' ')
}

/** Whole years elapsed since a "YYYY-MM" value. */
export function yearsSince(start: string): number {
  return Math.floor(monthsBetween(start, null) / 12)
}

/** ISO timestamp → "Sep 27, 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}
