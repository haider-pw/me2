<script setup lang="ts">
import { experience } from '~/data/experience'
import { education, profile } from '~/data/profile'

usePageSeo({
  title: 'Experience',
  description: `${profile.name}'s professional journey — ${yearsSince(profile.careerStart)}+ years of full-stack development and team leadership.`,
})

const years = yearsSince(profile.careerStart)
</script>

<template>
  <div class="space-y-28 sm:space-y-36">
    <section class="relative" aria-labelledby="work-title">
      <HeroBackground />
      <div class="container-page pt-10 sm:pt-14">
        <SectionHeader
          as="h1"
          eyebrow="Experience"
          :description="`From turning Photoshop files into HTML in 2012 to leading a frontend team today — ${years}+ years of learning, building and leading.`"
        >
          <template #title>
            <span id="work-title">Every step of the <span class="font-serif font-normal italic">journey</span></span>
          </template>
        </SectionHeader>

        <div v-reveal="200" class="-mt-4 mb-14 flex flex-wrap gap-3">
          <a :href="profile.resumeUrl" target="_blank" class="btn btn-primary">
            <Icon name="lucide:file-down" class="size-4" />
            Download résumé (PDF)
          </a>
          <NuxtLink to="/projects" class="btn btn-secondary group">
            Browse projects
            <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <div class="max-w-4xl">
          <ExperienceTimeline :items="experience" />
        </div>
      </div>
    </section>

    <section class="container-page" aria-labelledby="education-title">
      <SectionHeader eyebrow="Education">
        <template #title>
          <span id="education-title">Academic <span class="font-serif font-normal italic">background</span></span>
        </template>
      </SectionHeader>
      <div class="grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
        <SpotlightCard v-for="(item, i) in education" :key="item.degree" v-reveal="i * 100" class="p-6">
          <div class="flex items-center justify-between">
            <span class="grid size-11 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
              <Icon name="lucide:graduation-cap" class="size-5" />
            </span>
            <span class="chip">{{ item.year }}</span>
          </div>
          <h3 class="mt-5 font-semibold tracking-tight">
            {{ item.degree }} in {{ item.field }}
          </h3>
          <p class="mt-1 text-sm text-fg-muted">
            {{ item.school }}
          </p>
        </SpotlightCard>
      </div>
    </section>

    <ContactCta />
  </div>
</template>
