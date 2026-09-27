<script setup lang="ts">
import { profile } from '~/data/profile'

const { navigation } = useNavigation()
const year = new Date().getFullYear()

// Local time in Islamabad — rendered client-side only to avoid hydration drift.
const now = shallowRef(new Date())
useIntervalFn(() => { now.value = new Date() }, 30_000)
const localTime = computed(() =>
  now.value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: profile.timezone }),
)
</script>

<template>
  <footer class="relative mt-32 border-t border-border">
    <div class="container-page grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
      <div class="space-y-4">
        <AppLogo />
        <p class="max-w-xs text-sm leading-relaxed text-fg-muted">
          {{ profile.tagline }}
        </p>
        <p class="flex items-center gap-2 font-mono text-xs text-fg-subtle">
          <Icon name="lucide:map-pin" class="size-3.5" />
          {{ profile.location }}
          <ClientOnly>
            <span aria-hidden="true">·</span>
            <span>{{ localTime }} local time</span>
          </ClientOnly>
        </p>
      </div>

      <nav aria-label="Footer">
        <h2 class="mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">
          Navigate
        </h2>
        <ul class="space-y-2.5 text-sm" role="list">
          <li v-for="item in navigation" :key="item.to">
            <NuxtLink :to="item.to" class="text-fg-muted transition-colors hover:text-fg">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">
          Connect
        </h2>
        <ul class="space-y-2.5 text-sm" role="list">
          <li v-for="social in profile.socials" :key="social.name">
            <a :href="social.url" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg">
              {{ social.name }}
              <Icon name="lucide:arrow-up-right" class="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
          </li>
          <li>
            <a :href="`mailto:${profile.email}`" class="text-fg-muted transition-colors hover:text-fg">Email</a>
          </li>
          <li>
            <a :href="profile.resumeUrl" target="_blank" class="text-fg-muted transition-colors hover:text-fg">Résumé (PDF)</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-border">
      <div class="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-fg-subtle sm:flex-row">
        <p>© {{ year }} {{ profile.name }}. All rights reserved.</p>
        <p class="flex items-center gap-1.5">
          Built with
          <Icon name="simple-icons:nuxt" class="size-3.5" /> Nuxt &
          <Icon name="simple-icons:tailwindcss" class="size-3.5" /> Tailwind
        </p>
      </div>
    </div>
  </footer>
</template>
