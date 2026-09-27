<script setup lang="ts">
import { profile } from '~/data/profile'
import { projectCategories, projects } from '~/data/projects'
import type { ProjectCategory } from '~/data/projects'

usePageSeo({
  title: 'Portfolio & projects',
  description: `Selected projects by ${profile.name}: headless e-commerce storefronts, SaaS platforms, communities and websites.`,
})

const filters = ['All', ...projectCategories] as const
type Filter = (typeof filters)[number]

const active = ref<Filter>('All')
const counts = computed(() =>
  Object.fromEntries(filters.map(f => [f, f === 'All' ? projects.length : projects.filter(p => p.category === f).length])),
)
const visible = computed(() =>
  active.value === 'All' ? projects : projects.filter(p => p.category === (active.value as ProjectCategory)),
)
</script>

<template>
  <div class="space-y-28 sm:space-y-36">
    <section class="relative" aria-labelledby="projects-title">
      <HeroBackground />
      <div class="container-page pt-10 sm:pt-14">
        <SectionHeader
          as="h1"
          eyebrow="Portfolio"
          description="E-commerce storefronts, SaaS platforms, community sites and more, built over more than a decade. Click a card to visit the live site."
        >
          <template #title>
            <span id="projects-title">Work I’m <span class="font-serif font-normal italic">proud</span> of</span>
          </template>
        </SectionHeader>

        <div v-reveal="180" class="-mt-4 mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap" role="tablist" aria-label="Filter projects by category">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            role="tab"
            :aria-selected="active === filter"
            class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300"
            :class="active === filter
              ? 'border-fg bg-fg text-bg'
              : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg'"
            @click="active = filter"
          >
            {{ filter }}
            <span class="font-mono text-[11px]" :class="active === filter ? 'opacity-70' : 'text-fg-subtle'">{{ counts[filter] }}</span>
          </button>
        </div>

        <TransitionGroup
          tag="div"
          class="relative grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          move-class="transition-transform duration-500 ease-out-expo"
          enter-active-class="transition duration-500 ease-out-expo"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-for="(project, i) in visible" :key="project.slug">
            <ProjectCard :project="project" :eager="i < 3" sizes="(min-width: 1024px) 370px, (min-width: 768px) 50vw, 100vw" />
          </div>
        </TransitionGroup>
      </div>
    </section>

    <ContactCta />
  </div>
</template>
