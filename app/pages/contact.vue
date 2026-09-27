<script setup lang="ts">
import { profile } from '~/data/profile'

usePageSeo({
  title: 'Contact',
  description: `Get in touch with ${profile.name} about roles, freelance projects or collaborations. Send a message or email ${profile.email}.`,
})

const { copy, copied } = useClipboard({ copiedDuring: 2000, legacy: true })

const channels = [
  ...profile.socials.map(s => ({ label: s.name, value: s.handle, href: s.url, icon: s.icon, external: true })),
  { label: 'Résumé', value: 'Download PDF', href: profile.resumeUrl, icon: 'lucide:file-down', external: true },
]

// Live local time and offset relative to the visitor (client-only).
const now = shallowRef(new Date())
useIntervalFn(() => { now.value = new Date() }, 30_000)
const localTime = computed(() =>
  now.value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: profile.timezone }),
)
const hourInIslamabad = computed(() =>
  Number(now.value.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: profile.timezone })) % 24,
)
const isWorkingHours = computed(() => hourInIslamabad.value >= 9 && hourInIslamabad.value < 19)
/** UTC offset of a time zone in minutes, e.g. Asia/Karachi → 300. */
function utcOffsetMinutes(timeZone: string, date: Date) {
  const name = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? 'GMT'
  const match = name.match(/GMT([+-])(\d{2}):?(\d{2})?/)
  if (!match) return 0
  return (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0))
}
const offsetNote = computed(() => {
  const diffMinutes = utcOffsetMinutes(profile.timezone, now.value) + now.value.getTimezoneOffset()
  if (diffMinutes === 0) return 'Same time zone as you'
  const hours = Math.abs(diffMinutes) / 60
  const label = Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
  return `${label} hour${hours === 1 ? '' : 's'} ${diffMinutes > 0 ? 'ahead of' : 'behind'} you`
})
</script>

<template>
  <section class="relative" aria-labelledby="contact-title">
    <HeroBackground />
    <!-- Mobile order: intro → form → channels. Desktop: intro + channels left, form right. -->
    <div class="container-page grid grid-cols-1 gap-x-16 gap-y-10 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.25fr] lg:grid-rows-[auto_1fr]">
      <div class="lg:col-start-1 lg:row-start-1">
        <p v-reveal class="eyebrow">
          <span class="h-px w-6 bg-accent" aria-hidden="true" />
          Contact
        </p>
        <h1 id="contact-title" v-reveal="60" class="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Let’s <span class="font-serif font-normal italic">talk</span>.
        </h1>
        <p v-reveal="120" class="mt-6 max-w-md text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          Hiring for a frontend or full-stack role, planning a project, or just want to talk Vue, Nuxt or Laravel? Send me a message. I read every one and reply personally.
        </p>
      </div>

      <div v-reveal="150" class="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <ContactForm />
      </div>

      <div class="lg:col-start-1 lg:row-start-2">

        <!-- Email -->
        <div v-reveal="180" class="card flex items-center gap-4 p-4 sm:p-5">
          <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
            <Icon name="lucide:mail" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-mono text-[11px] tracking-wider text-fg-subtle uppercase">
              Prefer email?
            </p>
            <a :href="`mailto:${profile.email}`" class="block truncate font-medium hover:text-accent">{{ profile.email }}</a>
          </div>
          <button
            type="button"
            class="grid size-10 shrink-0 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            :aria-label="copied ? 'Email copied' : 'Copy email address'"
            @click="copy(profile.email)"
          >
            <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-4" :class="copied ? 'text-accent' : ''" />
          </button>
          <span class="sr-only" aria-live="polite">{{ copied ? 'Email copied to clipboard' : '' }}</span>
        </div>

        <!-- Other channels -->
        <ul v-reveal="240" class="mt-3 grid grid-cols-1 gap-3 xs:grid-cols-3" role="list">
          <li v-for="channel in channels" :key="channel.label">
            <a
              :href="channel.href"
              :target="channel.external ? '_blank' : undefined"
              rel="noopener noreferrer"
              class="card group flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong xs:flex-col xs:items-start"
            >
              <Icon :name="channel.icon" class="size-5 text-fg-muted transition-colors group-hover:text-accent" />
              <span class="min-w-0">
                <span class="block text-sm font-medium">{{ channel.label }}</span>
                <span class="block truncate text-xs text-fg-subtle">{{ channel.value }}</span>
              </span>
              <Icon name="lucide:arrow-up-right" class="ml-auto size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 xs:hidden" />
            </a>
          </li>
        </ul>

        <!-- Local time -->
        <div v-reveal="300" class="mt-3 flex items-center gap-4 rounded-2xl border border-dashed border-border p-4 sm:p-5">
          <span class="relative flex size-2.5 shrink-0">
            <span v-if="isWorkingHours" class="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent" />
            <span class="relative inline-flex size-2.5 rounded-full" :class="isWorkingHours ? 'bg-accent' : 'bg-fg-subtle'" />
          </span>
          <p class="text-sm text-fg-muted">
            Based in <span class="text-fg">{{ profile.location }}</span>
            <ClientOnly>
              <span class="block text-xs text-fg-subtle sm:inline sm:text-sm">
                <span class="hidden sm:inline"> · </span>{{ localTime }} there, {{ offsetNote.toLowerCase() }}
              </span>
            </ClientOnly>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
