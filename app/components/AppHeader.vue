<script setup lang="ts">
import { profile } from '~/data/profile'

const { navigation, isActive } = useNavigation()
const palette = useCommandPalette()
const route = useRoute()

const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 12)

const mobileOpen = ref(false)
watch(() => route.fullPath, () => { mobileOpen.value = false })
watch(mobileOpen, (open) => {
  if (import.meta.client) document.documentElement.style.overflow = open ? 'hidden' : ''
})
onKeyStroke('Escape', () => { mobileOpen.value = false })

// Sliding highlight that follows the hovered (or active) nav link.
const navRef = ref<HTMLElement>()
const linkRefs = ref<HTMLElement[]>([])
const hovered = ref<number | null>(null)
const indicator = ref({ left: 0, width: 0, visible: false })

function updateIndicator() {
  const activeIndex = navigation.findIndex(item => isActive(item.to))
  const index = hovered.value ?? activeIndex
  const el = linkRefs.value[index]
  if (!el || index < 0) {
    indicator.value.visible = false
    return
  }
  indicator.value = { left: el.offsetLeft, width: el.offsetWidth, visible: true }
}

watch([hovered, () => route.path], () => nextTick(updateIndicator))
onMounted(() => {
  updateIndicator()
  // Recalculate once web fonts have loaded and changed link widths.
  document.fonts?.ready.then(updateIndicator)
})
useResizeObserver(navRef, updateIndicator)

const isMac = ref(true)
onMounted(() => { isMac.value = /Mac|iPhone|iPad/.test(navigator.platform) })
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
    <div
      class="flex w-full max-w-6xl items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-3 transition-all duration-500 ease-out-expo sm:pl-4"
      :class="scrolled || mobileOpen ? 'glass shadow-[0_8px_32px_-12px_hsl(var(--shadow-color)/0.25)]' : 'border border-transparent'"
    >
      <AppLogo />

      <!-- Desktop navigation -->
      <nav ref="navRef" aria-label="Primary" class="relative hidden items-center md:flex" @mouseleave="hovered = null">
        <span
          aria-hidden="true"
          class="absolute inset-y-0 rounded-full bg-surface-2 transition-all duration-300 ease-out-expo"
          :class="indicator.visible ? 'opacity-100' : 'opacity-0'"
          :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
        />
        <NuxtLink
          v-for="(item, i) in navigation"
          :key="item.to"
          :ref="(el: any) => { if (el?.$el) linkRefs[i] = el.$el }"
          :to="item.to"
          class="relative z-10 rounded-full px-3.5 py-2 text-sm transition-colors lg:px-4"
          :class="isActive(item.to) ? 'text-fg' : 'text-fg-muted hover:text-fg'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          @mouseenter="hovered = i"
          @focus="hovered = i"
        >
          {{ item.label }}
          <span
            v-if="isActive(item.to)"
            class="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
            aria-hidden="true"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="hidden items-center gap-2 rounded-full border border-border bg-surface/60 py-1.5 pr-1.5 pl-3 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg sm:flex"
          aria-label="Open command palette"
          @click="palette.show()"
        >
          <Icon name="lucide:search" class="size-3.5" />
          <span>Search</span>
          <kbd class="rounded-full border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
        </button>
        <button
          type="button"
          class="grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg sm:hidden"
          aria-label="Open command palette"
          @click="palette.show()"
        >
          <Icon name="lucide:search" class="size-[18px]" />
        </button>
        <ThemeToggle />
        <a :href="profile.resumeUrl" target="_blank" class="btn btn-primary hidden !px-4 !py-2 lg:inline-flex">
          Résumé
          <Icon name="lucide:arrow-down-to-line" class="size-4" />
        </a>
        <button
          type="button"
          class="relative grid size-9 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 md:hidden"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="relative block h-3 w-4" aria-hidden="true">
            <span class="absolute left-0 h-[1.5px] w-4 rounded bg-current transition-all duration-300 ease-out-expo" :class="mobileOpen ? 'top-1.5 rotate-45' : 'top-0'" />
            <span class="absolute top-1.5 left-0 h-[1.5px] w-4 rounded bg-current transition-all duration-300" :class="mobileOpen ? 'opacity-0' : ''" />
            <span class="absolute left-0 h-[1.5px] w-4 rounded bg-current transition-all duration-300 ease-out-expo" :class="mobileOpen ? 'top-1.5 -rotate-45' : 'top-3'" />
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-500 ease-out-expo"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        id="mobile-menu"
        class="fixed inset-0 -z-10 flex flex-col bg-bg/95 px-6 pt-24 pb-8 backdrop-blur-xl md:hidden"
      >
        <nav aria-label="Mobile" class="flex flex-col">
          <NuxtLink
            v-for="(item, i) in navigation"
            :key="item.to"
            :to="item.to"
            class="mobile-link group flex items-center justify-between border-b border-border py-4 text-3xl font-medium tracking-tight"
            :class="isActive(item.to) ? 'text-fg' : 'text-fg-muted'"
            :style="{ animationDelay: `${60 + i * 50}ms` }"
          >
            <span class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-fg-subtle">0{{ i + 1 }}</span>
              {{ item.label }}
            </span>
            <Icon name="lucide:arrow-up-right" class="size-6 text-fg-subtle transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </NuxtLink>
        </nav>
        <div class="mobile-link mt-auto flex flex-col gap-4" style="animation-delay: 360ms">
          <a :href="profile.resumeUrl" target="_blank" class="btn btn-primary w-full !py-3">
            Download résumé
            <Icon name="lucide:arrow-down-to-line" class="size-4" />
          </a>
          <SocialLinks class="justify-center" />
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-link {
  animation: mobile-in 0.6s var(--ease-out-expo) both;
}
@keyframes mobile-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
</style>
