<script setup lang="ts">
import { experience } from '~/data/experience'
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'

usePageSeo({
  title: `${profile.name} — ${profile.role}`,
  description: `${profile.role} and ${profile.currentTitle.toLowerCase()} from ${profile.location}. ${profile.tagline}`,
  type: 'profile',
})

const years = yearsSince(profile.careerStart)
const featured = projects.filter(p => p.featured)

const stats = [
  { value: years, suffix: '+', label: 'Years building for the web' },
  { value: yearsSince('2013-01'), suffix: '+', label: 'Years leading teams' },
  { value: projects.length, suffix: '+', label: 'Products shipped' },
  { value: experience.length, suffix: '', label: 'Companies' },
]

const { data: posts, error: postsError } = await useBlogPosts()
const latestPosts = computed(() => (posts.value ?? []).slice(0, 3))
</script>

<template>
  <div class="space-y-28 sm:space-y-36">
    <!-- Hero -->
    <section class="relative" aria-labelledby="hero-title">
      <HeroBackground />
      <div class="container-page grid grid-cols-1 items-center gap-14 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pt-16">
        <div>
          <NuxtLink
            v-reveal
            to="/work"
            class="group inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 py-1.5 pr-3 pl-2 text-xs text-fg-muted backdrop-blur transition-colors hover:border-border-strong hover:text-fg sm:text-sm"
          >
            <span class="relative flex size-2">
              <span class="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent" />
              <span class="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {{ profile.currentTitle }} at {{ profile.currentCompany }}
            <Icon name="lucide:arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </NuxtLink>

          <h1 id="hero-title" v-reveal="80" class="mt-7 text-[2.75rem] leading-[1.02] font-semibold tracking-tight text-balance xs:text-5xl sm:text-6xl lg:text-7xl">
            Hi, I’m {{ profile.firstName }}.
            <span class="block text-fg-muted">
              I build <span class="font-serif font-normal text-fg italic">delightful</span>
              <span class="text-gradient"> web products.</span>
            </span>
          </h1>

          <p v-reveal="160" class="mt-7 max-w-xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
            {{ profile.intro }}
          </p>

          <div v-reveal="240" class="mt-9 flex flex-wrap items-center gap-3">
            <NuxtLink to="/projects" class="btn btn-primary group !px-6 !py-3">
              View my work
              <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </NuxtLink>
            <a :href="profile.resumeUrl" target="_blank" class="btn btn-secondary !px-6 !py-3">
              <Icon name="lucide:file-down" class="size-4" />
              Download résumé
            </a>
          </div>

          <div v-reveal="300" class="mt-8 flex items-center gap-4">
            <SocialLinks />
            <span class="h-5 w-px bg-border" aria-hidden="true" />
            <span class="flex items-center gap-1.5 font-mono text-xs text-fg-subtle">
              <Icon name="lucide:map-pin" class="size-3.5" />
              {{ profile.location }}
            </span>
          </div>
        </div>

        <div v-reveal="200" class="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
          <div class="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-[var(--glow-1)] to-[var(--glow-2)] opacity-60 blur-2xl" aria-hidden="true" />
          <HeroCodeCard class="lg:rotate-[1.5deg] lg:transition-transform lg:duration-700 lg:ease-out-expo lg:hover:rotate-0" />
        </div>
      </div>

      <div v-reveal="350" class="mt-20 sm:mt-24">
        <p class="mb-5 text-center font-mono text-xs tracking-widest text-fg-subtle uppercase">
          Tools of the trade
        </p>
        <TechMarquee />
      </div>
    </section>

    <!-- Stats -->
    <section class="container-page" aria-label="At a glance">
      <div class="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
        <div v-for="(stat, i) in stats" :key="stat.label" v-reveal="i * 80" class="bg-surface p-6 sm:p-8">
          <StatCounter :value="stat.value" :suffix="stat.suffix" :label="stat.label" />
        </div>
      </div>
    </section>

    <!-- Featured projects -->
    <section class="container-page" aria-labelledby="featured-title">
      <SectionHeader
        eyebrow="Selected work"
        description="A few products I’ve led or built, from high-traffic headless storefronts to custom SaaS platforms."
        :link="{ label: 'All projects', to: '/projects' }"
      >
        <template #title>
          <span id="featured-title">Things I’ve <span class="font-serif font-normal italic">shipped</span></span>
        </template>
      </SectionHeader>
      <div class="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <div v-for="(project, i) in featured" :key="project.slug" v-reveal="(i % 2) * 100">
          <ProjectCard :project="project" />
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="container-page" aria-labelledby="experience-title">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <SectionHeader
            eyebrow="Experience"
            :description="`${years}+ years across product companies and agencies, from intern to team lead.`"
          >
            <template #title>
              <span id="experience-title">Where I’ve <span class="font-serif font-normal italic">worked</span></span>
            </template>
          </SectionHeader>
          <div v-reveal="200" class="-mt-4 flex flex-wrap gap-3">
            <NuxtLink to="/work" class="btn btn-secondary group">
              Full experience
              <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </NuxtLink>
            <a :href="profile.resumeUrl" target="_blank" class="btn btn-ghost">
              <Icon name="lucide:file-down" class="size-4" />
              Résumé
            </a>
          </div>
        </div>
        <ExperienceTimeline :items="experience.slice(0, 3)" compact />
      </div>
    </section>

    <!-- Latest posts -->
    <section v-if="!postsError && latestPosts.length" class="container-page" aria-labelledby="posts-title">
      <SectionHeader
        eyebrow="Writing"
        description="Notes on problems I’ve solved, tools I use, and lessons learned along the way."
        :link="{ label: 'All posts', to: '/blog' }"
      >
        <template #title>
          <span id="posts-title">Latest from the <span class="font-serif font-normal italic">blog</span></span>
        </template>
      </SectionHeader>
      <div class="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(post, i) in latestPosts" :key="post.id" v-reveal="i * 100" :class="i === 2 ? 'md:hidden lg:block' : ''">
          <BlogCard :post="post" />
        </div>
      </div>
    </section>

    <ContactCta />
  </div>
</template>
