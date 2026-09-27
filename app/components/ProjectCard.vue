<script setup lang="ts">
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project, eager?: boolean, sizes?: string }>()

const primaryLink = computed(() => props.project.url ?? props.project.links?.[0]?.url)
const host = computed(() => {
  if (props.project.url) return new URL(props.project.url).host.replace(/^www\./, '')
  return props.project.links?.[0]?.label
})
</script>

<template>
  <SpotlightCard as="article" :id="project.slug" class="flex h-full scroll-mt-20 flex-col transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-border-strong">
    <ProjectCover :project="project" :eager="eager" :sizes="sizes" class="border-b border-border" />

    <div class="flex flex-1 flex-col gap-4 p-5 sm:p-6">
      <div class="flex items-center justify-between gap-3 font-mono text-xs text-fg-subtle">
        <span class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {{ project.category }}
        </span>
        <span>{{ project.year }}</span>
      </div>

      <div class="space-y-2">
        <h3 class="text-xl font-semibold tracking-tight">
          <a
            v-if="primaryLink"
            :href="primaryLink"
            target="_blank"
            rel="noopener noreferrer"
            class="after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
          >
            {{ project.title }}
          </a>
          <template v-else>{{ project.title }}</template>
        </h3>
        <p class="text-sm leading-relaxed text-fg-muted">
          {{ project.summary }}
        </p>
      </div>

      <ul class="mt-auto flex flex-wrap gap-1.5 pt-2" role="list" aria-label="Tech stack">
        <li v-for="tech in project.stack" :key="tech" class="chip">
          {{ tech }}
        </li>
      </ul>

      <div class="flex items-center justify-between gap-3 border-t border-border pt-4 text-xs">
        <span class="truncate text-fg-subtle">
          {{ project.company }}<template v-if="project.role"> · {{ project.role }}</template>
        </span>
        <span v-if="host" class="flex shrink-0 items-center gap-1 font-medium text-fg-muted transition-colors group-hover/spot:text-accent">
          {{ host }}
          <Icon name="lucide:arrow-up-right" class="size-3.5 transition-transform duration-300 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5" />
        </span>
      </div>
    </div>
  </SpotlightCard>
</template>
