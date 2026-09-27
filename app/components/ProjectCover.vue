<script setup lang="ts">
import type { Project } from '~/data/projects'

/** Screenshot when available, otherwise a generated gradient cover. */
const props = withDefaults(defineProps<{
  project: Project
  eager?: boolean
  /** Rendered width hint for the browser to pick the right srcset candidate. */
  sizes?: string
}>(), { sizes: '(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw' })

// Resized copies (480/800/1200px) live next to each screenshot as name-<w>.webp.
const srcset = computed(() => {
  const img = props.project.image
  if (!img?.endsWith('.webp')) return undefined
  return [480, 800, 1200].map(w => `${img.replace(/\.webp$/, `-${w}.webp`)} ${w}w`).join(', ')
})
const src = computed(() => (srcset.value ? props.project.image!.replace(/\.webp$/, '-800.webp') : props.project.image))

// Stable hue per project so generated covers differ but never change.
const hue = computed(() => [...props.project.slug].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360)
</script>

<template>
  <div class="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
    <img
      v-if="project.image"
      :src="src"
      :srcset="srcset"
      :sizes="srcset ? sizes : undefined"
      :alt="`${project.title} — screenshot`"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      width="1280"
      height="800"
      class="size-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
    >
    <div
      v-else
      class="relative grid size-full place-items-center overflow-hidden"
      :style="{
        background: `radial-gradient(120% 90% at 0% 0%, oklch(0.72 0.14 ${hue} / 0.55), transparent 60%),
                     radial-gradient(100% 90% at 100% 100%, oklch(0.7 0.13 ${(hue + 70) % 360} / 0.5), transparent 60%),
                     var(--bg-subtle)`,
      }"
    >
      <div class="bg-grid absolute inset-0 opacity-60 mask-radial" aria-hidden="true" />
      <span class="relative font-serif text-4xl text-fg italic transition-transform duration-700 ease-out-expo group-hover:scale-105 sm:text-5xl">
        {{ project.title }}
      </span>
    </div>
    <div class="pointer-events-none absolute inset-0 ring-1 ring-fg/5 ring-inset" aria-hidden="true" />
  </div>
</template>
