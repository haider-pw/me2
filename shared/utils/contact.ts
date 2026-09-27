/** Contact form rules, shared by the browser form and the /api/contact route. */

export const CONTACT_TOPICS = {
  job: 'Job opportunity',
  project: 'Project',
  collab: 'Collaboration',
  hello: 'Just saying hi',
} as const

export type ContactTopic = keyof typeof CONTACT_TOPICS

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  messageMin: 20,
  messageMax: 2000,
  /** Link-stuffed messages are almost always spam. */
  maxLinks: 3,
} as const

const HAS_URL = /(https?:\/\/|www\.)\S+/i
const ALL_URLS = /(https?:\/\/|www\.)\S+/gi

export interface ContactInput {
  name: string
  email: string
  topic: string
  message: string
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {}
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()

  if (name.length < CONTACT_LIMITS.nameMin) errors.name = 'Please tell me your name.'
  else if (name.length > CONTACT_LIMITS.nameMax) errors.name = 'That name is a bit long.'
  else if (HAS_URL.test(name) || /[<>]/.test(name)) errors.name = 'Please enter just your name.'

  if (!EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.emailMax) {
    errors.email = 'Please enter a valid email, like you@company.com.'
  }

  if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `A little more detail please — at least ${CONTACT_LIMITS.messageMin} characters.`
  }
  else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Please keep it under ${CONTACT_LIMITS.messageMax} characters.`
  }
  else if ((message.match(ALL_URLS)?.length ?? 0) > CONTACT_LIMITS.maxLinks) {
    errors.message = `Please include no more than ${CONTACT_LIMITS.maxLinks} links.`
  }

  return errors
}

export function contactSubject(name: string, topic: string): string {
  const label = CONTACT_TOPICS[topic as ContactTopic]
  return `New message from ${name.trim() || 'your website'}${label ? ` · ${label}` : ''}`
}
