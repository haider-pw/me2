<script setup lang="ts">
import { profile } from '~/data/profile'

type Field = 'name' | 'email' | 'message'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const topics = [
  { value: 'job', icon: 'lucide:briefcase-business' },
  { value: 'project', icon: 'lucide:rocket' },
  { value: 'collab', icon: 'lucide:handshake' },
  { value: 'hello', icon: 'lucide:hand' },
].map(t => ({ ...t, label: CONTACT_TOPICS[t.value as ContactTopic] }))

const MESSAGE_MAX = CONTACT_LIMITS.messageMax

// Whether the server can send (Resend key present). Resolved during SSR so the
// secret never reaches the browser; only this boolean is serialised.
const sendingEnabled = useState('contact-enabled', () =>
  import.meta.server ? !!useRuntimeConfig().resendApiKey : false,
)
const route = useRoute()
const colorMode = useColorMode()

// Cloudflare Turnstile (bot protection). Only active when a site key is configured;
// "interaction-only" keeps it invisible unless Cloudflare needs a human check.
interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}
const turnstileSiteKey = useRuntimeConfig().public.turnstileSiteKey
const turnstileRef = ref<HTMLElement>()
const turnstileToken = ref('')
let turnstileId: string | undefined

function loadTurnstile(): Promise<TurnstileApi> {
  const w = window as unknown as { turnstile?: TurnstileApi }
  if (w.turnstile) return Promise.resolve(w.turnstile)
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => (w.turnstile ? resolve(w.turnstile) : reject(new Error('Turnstile unavailable')))
    script.onerror = () => reject(new Error('Turnstile failed to load'))
    document.head.appendChild(script)
  })
}

async function mountTurnstile() {
  if (!turnstileSiteKey || !turnstileRef.value || turnstileId) return
  try {
    const turnstile = await loadTurnstile()
    turnstileId = turnstile.render(turnstileRef.value, {
      'sitekey': turnstileSiteKey,
      'appearance': 'interaction-only',
      'theme': colorMode.value === 'dark' ? 'dark' : 'light',
      'callback': (token: string) => { turnstileToken.value = token },
      'expired-callback': () => { turnstileToken.value = '' },
      'error-callback': () => { turnstileToken.value = '' },
    })
  }
  catch (error) {
    console.warn('[contact] Turnstile could not load', error)
  }
}

// Mount the widget whenever its container appears (first load, or after "Send another").
watch(turnstileRef, el => el && mountTurnstile())

function resetTurnstile() {
  turnstileToken.value = ''
  const w = window as unknown as { turnstile?: TurnstileApi }
  if (turnstileId) w.turnstile?.reset(turnstileId)
}

// Draft survives navigation/reloads (per-browser convenience only).
const draft = useLocalStorage(
  'contact-draft',
  { name: '', email: '', topic: '', message: '' },
  { initOnMounted: true, mergeDefaults: true },
)

// Used to filter out bots that submit instantly.
let mountedAt = 0
onMounted(() => {
  mountedAt = Date.now()
  // Deep-link a topic, e.g. /contact?topic=job
  const topic = String(route.query.topic ?? '')
  if (topic in CONTACT_TOPICS) draft.value.topic = topic
})

const botcheck = ref(false)
const status = ref<Status>('idle')
const errorDetail = ref('')
const touched = reactive<Record<Field, boolean>>({ name: false, email: false, message: false })
const resultRef = ref<HTMLElement>()
const formRef = ref<HTMLFormElement>()

const errors = computed(() => validateContact(draft.value))
const showError = (field: Field) => touched[field] && !!errors.value[field]
const isValid = computed(() => Object.keys(errors.value).length === 0)

const subject = computed(() => contactSubject(draft.value.name, draft.value.topic))
const mailtoHref = computed(() =>
  `mailto:${profile.email}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(draft.value.message)}`,
)
const firstName = computed(() => draft.value.name.trim().split(/\s+/)[0] ?? '')

async function focusResult() {
  await nextTick()
  resultRef.value?.focus()
}

async function submit() {
  if (status.value === 'sending') return
  touched.name = touched.email = touched.message = true
  if (!isValid.value) {
    const firstInvalid = (['name', 'email', 'message'] as Field[]).find(f => errors.value[f])
    formRef.value?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus()
    return
  }

  // Sending isn't configured yet: hand off to the visitor's email app.
  if (!sendingEnabled.value) {
    window.location.href = mailtoHref.value
    return
  }

  if (turnstileSiteKey && !turnstileToken.value) {
    errorDetail.value = 'Please wait a moment while we check you’re not a bot, then press send again.'
    status.value = 'error'
    focusResult()
    return
  }

  status.value = 'sending'
  errorDetail.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...draft.value, botcheck: botcheck.value, elapsed: Date.now() - mountedAt, turnstileToken: turnstileToken.value },
      timeout: 15000,
    })
    status.value = 'sent'
  }
  catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode
    errorDetail.value = statusCode === 429
      ? 'You’ve sent several messages in a short time. Please try again in a few minutes.'
      : statusCode === 403
        ? 'We couldn’t verify you’re human. Please try again.'
        : ''
    status.value = 'error'
    focusResult()
  }
  finally {
    // Turnstile tokens are single-use.
    resetTurnstile()
  }
}

function reset() {
  draft.value = { name: draft.value.name, email: draft.value.email, topic: '', message: '' }
  touched.name = touched.email = touched.message = false
  status.value = 'idle'
  nextTick(() => formRef.value?.querySelector<HTMLElement>('#contact-message')?.focus())
}

// Clear the message from the saved draft once it has gone through.
watch(status, (value) => {
  if (value !== 'sent') return
  draft.value = { ...draft.value, topic: '', message: '' }
  // The form (and the Turnstile container) is replaced by the success screen.
  const w = window as unknown as { turnstile?: TurnstileApi }
  if (turnstileId) w.turnstile?.remove(turnstileId)
  turnstileId = undefined
})

const inputClass = (field: Field) => [
  'w-full rounded-xl border bg-bg px-4 py-3 text-[15px] transition-[border-color,box-shadow] outline-none placeholder:text-fg-subtle',
  'focus:border-accent focus:ring-4 focus:ring-accent-soft',
  showError(field) ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/15' : 'border-border hover:border-border-strong',
]
</script>

<template>
  <div class="card relative overflow-hidden p-6 sm:p-8">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-500 ease-out-expo"
      enter-from-class="opacity-0 translate-y-3"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
      @after-enter="status === 'sent' && focusResult()"
    >
      <!-- Success -->
      <div v-if="status === 'sent'" key="sent" ref="resultRef" tabindex="-1" class="flex min-h-[28rem] flex-col items-center justify-center text-center outline-none" role="status">
        <span class="success-ring grid size-16 place-items-center rounded-full bg-accent-soft text-accent">
          <Icon name="lucide:check" class="size-8" />
        </span>
        <h2 class="mt-6 text-2xl font-semibold tracking-tight">
          Thanks{{ firstName ? `, ${firstName}` : '' }}! Message sent.
        </h2>
        <p class="mt-3 max-w-sm text-fg-muted">
          It’s on its way to my inbox. I read every message personally and will reply to
          <span class="font-medium text-fg">{{ draft.email }}</span>.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/projects" class="btn btn-primary">
            Browse my work
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
          <button type="button" class="btn btn-secondary" @click="reset">
            Send another message
          </button>
        </div>
      </div>

      <!-- Form -->
      <form v-else key="form" ref="formRef" novalidate class="space-y-6" aria-describedby="contact-form-note" @submit.prevent="submit" @keydown.meta.enter.prevent="submit" @keydown.ctrl.enter.prevent="submit">
        <div v-if="status === 'error'" ref="resultRef" tabindex="-1" role="alert" class="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm outline-none">
          <Icon name="lucide:circle-alert" class="mt-0.5 size-5 shrink-0 text-red-500" />
          <div>
            <p class="font-medium">
              Your message couldn’t be sent.
            </p>
            <p class="mt-1 text-fg-muted">
              Nothing you wrote was lost. Try again, or
              <a :href="mailtoHref" class="font-medium text-fg underline underline-offset-4">send it from your email app</a>
              instead.
            </p>
            <p v-if="errorDetail" class="mt-1 text-xs text-fg-subtle">
              {{ errorDetail }}
            </p>
          </div>
        </div>

        <fieldset>
          <legend class="mb-3 text-sm font-medium">
            What’s it about? <span class="font-normal text-fg-subtle">(optional)</span>
          </legend>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="topic in topics"
              :key="topic.value"
              class="relative flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-200 select-none has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent-soft"
              :class="draft.topic === topic.value
                ? 'border-accent bg-accent-soft text-fg'
                : 'border-border bg-bg text-fg-muted hover:border-border-strong hover:text-fg'"
            >
              <input
                v-model="draft.topic"
                type="radio"
                name="topic"
                :value="topic.value"
                class="sr-only"
                @click="draft.topic === topic.value && (draft.topic = '')"
              >
              <Icon :name="topic.icon" class="size-4" :class="draft.topic === topic.value ? 'text-accent' : ''" />
              {{ topic.label }}
            </label>
          </div>
        </fieldset>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="contact-name" class="mb-2 block text-sm font-medium">Name</label>
            <input
              id="contact-name"
              v-model="draft.name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="Jane Doe"
              required
              :aria-invalid="showError('name')"
              :aria-describedby="showError('name') ? 'contact-name-error' : undefined"
              :class="inputClass('name')"
              @blur="touched.name = true"
            >
            <p v-if="showError('name')" id="contact-name-error" class="mt-2 flex items-center gap-1.5 text-xs text-red-500">
              <Icon name="lucide:circle-alert" class="size-3.5" /> {{ errors.name }}
            </p>
          </div>
          <div>
            <label for="contact-email" class="mb-2 block text-sm font-medium">Email</label>
            <input
              id="contact-email"
              v-model="draft.email"
              type="email"
              name="email"
              inputmode="email"
              autocomplete="email"
              autocapitalize="off"
              spellcheck="false"
              placeholder="jane@company.com"
              required
              :aria-invalid="showError('email')"
              :aria-describedby="showError('email') ? 'contact-email-error' : undefined"
              :class="inputClass('email')"
              @blur="touched.email = true"
            >
            <p v-if="showError('email')" id="contact-email-error" class="mt-2 flex items-center gap-1.5 text-xs text-red-500">
              <Icon name="lucide:circle-alert" class="size-3.5" /> {{ errors.email }}
            </p>
          </div>
        </div>

        <div>
          <div class="mb-2 flex items-baseline justify-between gap-3">
            <label for="contact-message" class="text-sm font-medium">Message</label>
            <span
              class="font-mono text-[11px] tabular-nums"
              :class="draft.message.length > MESSAGE_MAX ? 'text-red-500' : 'text-fg-subtle'"
              aria-hidden="true"
            >{{ draft.message.length }} / {{ MESSAGE_MAX }}</span>
          </div>
          <textarea
            id="contact-message"
            v-model="draft.message"
            name="message"
            rows="6"
            required
            placeholder="Tell me a bit about the role, project or idea — timelines and links are welcome."
            :aria-invalid="showError('message')"
            :aria-describedby="showError('message') ? 'contact-message-error' : 'contact-message-hint'"
            :class="[inputClass('message'), 'min-h-40 resize-y leading-relaxed']"
            @blur="touched.message = true"
          />
          <p v-if="showError('message')" id="contact-message-error" class="mt-2 flex items-center gap-1.5 text-xs text-red-500">
            <Icon name="lucide:circle-alert" class="size-3.5" /> {{ errors.message }}
          </p>
          <p v-else id="contact-message-hint" class="mt-2 text-xs text-fg-subtle">
            Your draft is saved in this browser until you send it.
          </p>
        </div>

        <!-- Cloudflare Turnstile renders here (usually invisible) -->
        <div v-if="turnstileSiteKey" ref="turnstileRef" class="empty:hidden" />

        <!-- Honeypot: hidden from people, tempting for bots -->
        <input v-model="botcheck" type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

        <div class="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p id="contact-form-note" class="text-xs leading-relaxed text-fg-subtle">
            Your details are only used to reply to you.
            <span class="hidden sm:inline">Press <kbd class="rounded border border-border bg-surface-2 px-1 font-mono">⌘/Ctrl ↵</kbd> to send.</span>
          </p>
          <button type="submit" class="btn btn-primary group shrink-0 !px-6 !py-3" :disabled="status === 'sending'">
            <template v-if="status === 'sending'">
              <Icon name="lucide:loader-circle" class="size-4 animate-spin" />
              Sending…
            </template>
            <template v-else>
              {{ sendingEnabled ? 'Send message' : 'Continue in email app' }}
              <Icon name="lucide:send" class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </template>
          </button>
        </div>
        <p class="sr-only" aria-live="polite">
          {{ status === 'sending' ? 'Sending your message' : '' }}
        </p>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.success-ring {
  animation: success-pop 0.6s var(--ease-spring) both;
  box-shadow: 0 0 0 0 var(--ring);
}
@keyframes success-pop {
  0% { transform: scale(0.4); opacity: 0; box-shadow: 0 0 0 0 var(--ring); }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); box-shadow: 0 0 0 14px transparent; }
}
</style>
