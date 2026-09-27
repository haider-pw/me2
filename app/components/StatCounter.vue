<script setup lang="ts">
/** Counts up to `value` the first time it scrolls into view. */
const props = defineProps<{ value: number, suffix?: string, label: string }>()

const el = ref<HTMLElement>()
const display = ref(props.value)
const started = ref(false)

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  display.value = 0
  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (!entry?.isIntersecting || started.value) return
    started.value = true
    stop()
    const duration = 1400
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - (1 - p) ** 4
      display.value = Math.round(props.value * eased)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, { threshold: 0.4 })
})
</script>

<template>
  <div ref="el" class="flex flex-col gap-1">
    <span class="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
      {{ display }}<span class="text-accent">{{ suffix }}</span>
    </span>
    <span class="text-sm text-fg-muted">{{ label }}</span>
  </div>
</template>
