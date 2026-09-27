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
} as const

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

  if (!EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.emailMax) {
    errors.email = 'Please enter a valid email, like you@company.com.'
  }

  if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `A little more detail please — at least ${CONTACT_LIMITS.messageMin} characters.`
  }
  else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Please keep it under ${CONTACT_LIMITS.messageMax} characters.`
  }

  return errors
}

export function contactSubject(name: string, topic: string): string {
  const label = CONTACT_TOPICS[topic as ContactTopic]
  return `New message from ${name.trim() || 'your website'}${label ? ` · ${label}` : ''}`
}
