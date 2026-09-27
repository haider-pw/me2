<script setup lang="ts">
/**
 * Card with a soft radial highlight that follows the pointer.
 * Renders as any element via `as` (defaults to div).
 */
withDefaults(defineProps<{ as?: string }>(), { as: 'div' })

const el = ref<HTMLElement>()
function onMove(event: PointerEvent) {
  if (!el.value) return
  const rect = el.value.getBoundingClientRect()
  el.value.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.value.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <component :is="as" ref="el" class="spotlight card group/spot relative isolate overflow-hidden" @pointermove="onMove">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      style="background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--accent-soft), transparent 65%)"
    />
    <slot />
  </component>
</template>
