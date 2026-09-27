<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

/**
 * Switch theme with a circular reveal from the button, using the
 * View Transitions API where supported (instant switch elsewhere).
 */
function toggle(event: MouseEvent) {
  const next = isDark.value ? 'light' : 'dark'
  const apply = () => {
    colorMode.preference = next
    // Apply synchronously so the view transition snapshots the new theme.
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.classList.toggle('light', next === 'light')
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    apply()
    return
  }

  const x = event.clientX || window.innerWidth - 40
  const y = event.clientY || 40
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  const transition = document.startViewTransition(apply)
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 550, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}
</script>

<template>
  <button
    type="button"
    class="relative grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <ClientOnly>
      <Transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-spring"
        enter-from-class="opacity-0 rotate-90 scale-50"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0 -rotate-90 scale-50"
      >
        <Icon v-if="isDark" key="moon" name="lucide:moon" class="size-[18px]" />
        <Icon v-else key="sun" name="lucide:sun" class="size-[18px]" />
      </Transition>
      <template #fallback>
        <Icon name="lucide:sun-moon" class="size-[18px]" />
      </template>
    </ClientOnly>
  </button>
</template>
