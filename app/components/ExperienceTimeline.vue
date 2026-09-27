<script setup lang="ts">
import type { Experience } from '~/data/experience'

const props = defineProps<{ items: Experience[], compact?: boolean }>()

// The accent line fills as the timeline scrolls through the viewport.
const root = ref<HTMLElement>()
const { top, height } = useElementBounding(root)
const { height: viewport } = useWindowSize()
const progress = computed(() => {
  if (!height.value) return 0
  const p = (viewport.value * 0.6 - top.value) / height.value
  return Math.min(1, Math.max(0, p))
})

const expanded = ref<Set<string>>(new Set(props.compact ? [] : [props.items[0]?.id ?? '']))
function toggle(id: string) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}
</script>

<template>
  <ol ref="root" class="relative space-y-6 sm:space-y-8" role="list">
    <!-- rail -->
    <span class="absolute top-2 bottom-2 left-[23px] w-px bg-border sm:left-[27px]" aria-hidden="true" />
    <span
      class="absolute top-2 left-[23px] w-px origin-top bg-gradient-to-b from-accent to-accent-2 sm:left-[27px]"
      :style="{ height: `calc((100% - 1rem) * ${progress})` }"
      aria-hidden="true"
    />

    <li
      v-for="(job, i) in items"
      :key="job.id"
      v-reveal="i * 60"
      class="relative grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-6"
    >
      <div class="relative z-10 flex justify-center pt-1">
        <CompanyLogo :name="job.company" :logo="job.logo" />
        <span v-if="!job.end" class="absolute -top-0.5 -right-0.5 flex size-3" aria-hidden="true">
          <span class="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent" />
          <span class="relative inline-flex size-3 rounded-full border-2 border-bg bg-accent" />
        </span>
      </div>

      <SpotlightCard class="p-5 sm:p-6">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 class="text-lg font-semibold tracking-tight">
              {{ job.role }}
            </h3>
            <p class="text-sm text-fg-muted">
              <a v-if="job.url" :href="job.url" target="_blank" rel="noopener noreferrer" class="font-medium text-fg hover:text-accent">{{ job.company }}</a>
              <span v-else class="font-medium text-fg">{{ job.company }}</span>
              <span class="text-fg-subtle"> · {{ job.location }}</span>
            </p>
          </div>
          <div class="flex shrink-0 flex-wrap items-center gap-2 font-mono text-xs text-fg-subtle sm:flex-col sm:items-end sm:gap-1">
            <span>{{ formatPeriod(job.start, job.end) }}</span>
            <span class="rounded-full bg-accent-soft px-2 py-0.5 text-accent">{{ formatDuration(job.start, job.end) }}</span>
          </div>
        </div>

        <p class="mt-4 text-sm leading-relaxed text-fg-muted">
          {{ job.summary }}
        </p>

        <template v-if="!compact">
          <div
            class="grid transition-[grid-template-rows] duration-500 ease-out-expo"
            :class="expanded.has(job.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <ul class="mt-4 space-y-2.5" role="list">
                <li v-for="point in job.highlights" :key="point" class="flex gap-3 text-sm leading-relaxed text-fg-muted">
                  <Icon name="lucide:chevron-right" class="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
            :aria-expanded="expanded.has(job.id)"
            @click="toggle(job.id)"
          >
            {{ expanded.has(job.id) ? 'Show less' : `Show ${job.highlights.length} highlights` }}
            <Icon name="lucide:chevron-down" class="size-3.5 transition-transform duration-300" :class="expanded.has(job.id) ? 'rotate-180' : ''" />
          </button>
        </template>

        <ul class="mt-4 flex flex-wrap gap-1.5" role="list" aria-label="Tech stack">
          <li v-for="tech in job.stack" :key="tech" class="chip">
            {{ tech }}
          </li>
        </ul>
      </SpotlightCard>
    </li>
  </ol>
</template>
