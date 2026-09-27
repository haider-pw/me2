/**
 * POST /api/contact — delivers a contact-form message through Resend.
 * Needs NUXT_RESEND_API_KEY; the sender must be on a domain verified in Resend.
 */

const MIN_FILL_MS = 2500
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }
// Best-effort per-isolate limiter; enough to stop casual abuse.
const recent = new Map<string, number[]>()

function isRateLimited(key: string) {
  const now = Date.now()
  const hits = (recent.get(key) ?? []).filter(t => now - t < RATE_LIMIT.windowMs)
  hits.push(now)
  recent.set(key, hits)
  if (recent.size > 1000) recent.clear()
  return hits.length > RATE_LIMIT.max
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' })[c]!)
}

interface Body extends ContactInput {
  botcheck?: boolean
  elapsed?: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.resendApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Contact form is not configured' })
  }

  const body = await readBody<Partial<Body>>(event).catch(() => null)
  const input: ContactInput = {
    name: String(body?.name ?? ''),
    email: String(body?.email ?? ''),
    topic: String(body?.topic ?? ''),
    message: String(body?.message ?? ''),
  }

  // Bots: pretend success so they don't retry.
  if (body?.botcheck || (typeof body?.elapsed === 'number' && body.elapsed < MIN_FILL_MS)) {
    return { ok: true }
  }

  const errors = validateContact(input)
  if (Object.keys(errors).length) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid input', data: { errors } })
  }

  const ip = getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many messages, please try again later' })
  }

  // Collapse whitespace/newlines so the name can't break the subject line.
  const name = input.name.trim().replace(/\s+/g, ' ')
  const email = input.email.trim()
  const message = input.message.trim()
  const topic = CONTACT_TOPICS[input.topic as ContactTopic] ?? 'Not specified'

  const text = `${message}\n\n—\nFrom: ${name} <${email}>\nTopic: ${topic}\nSent from the contact form on haider.pw`
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#18181b;max-width:560px">
      <p style="margin:0 0 16px;white-space:pre-wrap">${escapeHtml(message)}</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0">
      <table style="font-size:13px;color:#52525b">
        <tr><td style="padding:2px 12px 2px 0">From</td><td><strong style="color:#18181b">${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</td></tr>
        <tr><td style="padding:2px 12px 2px 0">Topic</td><td>${escapeHtml(topic)}</td></tr>
      </table>
      <p style="font-size:12px;color:#a1a1aa;margin-top:16px">Sent from the contact form on haider.pw. Reply to this email to answer ${escapeHtml(name)} directly.</p>
    </div>`

  try {
    await $fetch('/emails', {
      baseURL: config.contact.resendApiBase,
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: {
        from: config.contact.from,
        to: [config.contact.to],
        reply_to: email,
        subject: contactSubject(name, input.topic),
        text,
        html,
      },
      timeout: 10000,
    })
  }
  catch (error) {
    const data = (error as { data?: unknown }).data
    console.error('[contact] Resend request failed', data ?? error)
    throw createError({ statusCode: 502, statusMessage: 'Could not send the message' })
  }

  return { ok: true }
})
