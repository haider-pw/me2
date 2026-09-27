<script setup lang="ts">
import { education, profile } from '~/data/profile'
import { skillGroups } from '~/data/skills'

usePageSeo({
  title: `About ${profile.name} — ${profile.role} in Islamabad`,
  description: `Get to know ${profile.name} — ${profile.role.toLowerCase()} based in ${profile.location}, skills, principles and background.`,
  type: 'profile',
})

const years = yearsSince(profile.careerStart)

const facts = [
  { icon: 'lucide:briefcase-business', label: 'Currently', value: `${profile.currentTitle} · ${profile.currentCompany}` },
  { icon: 'lucide:map-pin', label: 'Based in', value: profile.location },
  { icon: 'lucide:calendar-clock', label: 'Experience', value: `${years}+ years` },
  { icon: 'lucide:graduation-cap', label: 'Education', value: 'MS Software Engineering' },
]
</script>

<template>
  <div class="space-y-28 sm:space-y-36">
    <section class="relative" aria-labelledby="about-title">
      <HeroBackground />
      <div class="container-page grid grid-cols-1 gap-12 pt-10 sm:pt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <p v-reveal class="eyebrow">
            <span class="h-px w-6 bg-accent" aria-hidden="true" />
            About me
          </p>
          <h1 id="about-title" v-reveal="60" class="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Engineer by trade, <span class="font-serif font-normal italic">craftsman</span> at heart.
          </h1>
          <div class="mt-8 space-y-5 text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
            <p v-for="(paragraph, i) in profile.about" :key="i" v-reveal="120 + i * 60">
              {{ paragraph }}
            </p>
          </div>
          <div v-reveal="400" class="mt-9 flex flex-wrap gap-3">
            <a :href="profile.resumeUrl" target="_blank" class="btn btn-primary">
              <Icon name="lucide:file-down" class="size-4" />
              Download résumé
            </a>
            <NuxtLink to="/work" class="btn btn-secondary group">
              See my experience
              <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </NuxtLink>
          </div>
        </div>

        <aside v-reveal="150" class="lg:sticky lg:top-24 lg:self-start">
          <div class="card overflow-hidden">
            <div
              class="group/photo relative grid place-items-center overflow-hidden border-b border-border bg-bg-subtle"
              :class="profile.avatar ? 'aspect-square' : 'aspect-[4/3]'"
            >
              <img
                v-if="profile.avatar"
                :src="profile.avatar"
                :alt="`Portrait of ${profile.name}`"
                width="500"
                height="500"
                decoding="async"
                class="size-full object-cover transition-transform duration-700 ease-out-expo group-hover/photo:scale-[1.03]"
              >
              <template v-else>
                <div class="absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_10%,var(--glow-1),transparent_60%),radial-gradient(80%_80%_at_90%_90%,var(--glow-2),transparent_60%)]" aria-hidden="true" />
                <div class="bg-grid absolute inset-0 mask-radial" aria-hidden="true" />
                <span class="relative font-serif text-8xl text-fg italic">{{ profile.initials }}</span>
              </template>
            </div>
            <div class="p-6">
              <p class="text-lg font-semibold tracking-tight">
                {{ profile.name }}
              </p>
              <p class="text-sm text-fg-muted">
                {{ profile.role }}
              </p>
              <dl class="mt-6 space-y-4">
                <div v-for="fact in facts" :key="fact.label" class="flex items-start gap-3">
                  <Icon :name="fact.icon" class="mt-0.5 size-4 shrink-0 text-accent" />
                  <div>
                    <dt class="font-mono text-[11px] tracking-wider text-fg-subtle uppercase">
                      {{ fact.label }}
                    </dt>
                    <dd class="text-sm">
                      {{ fact.value }}
                    </dd>
                  </div>
                </div>
              </dl>
              <div class="mt-6 flex items-center justify-between border-t border-border pt-5">
                <SocialLinks />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- Principles -->
    <section class="container-page" aria-labelledby="principles-title">
      <SectionHeader eyebrow="How I work" description="The values I bring to every codebase and every team.">
        <template #title>
          <span id="principles-title">Principles I <span class="font-serif font-normal italic">build</span> by</span>
        </template>
      </SectionHeader>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SpotlightCard v-for="(item, i) in profile.principles" :key="item.title" v-reveal="i * 80" class="p-6">
          <span class="grid size-11 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
            <Icon :name="item.icon" class="size-5" />
          </span>
          <h3 class="mt-5 font-semibold tracking-tight">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-fg-muted">
            {{ item.text }}
          </p>
        </SpotlightCard>
      </div>
    </section>

    <!-- Skills -->
    <section class="container-page" aria-labelledby="skills-title">
      <SectionHeader eyebrow="Toolbox" description="Technologies I’ve used in production, grouped by where they sit in the stack.">
        <template #title>
          <span id="skills-title">Skills & <span class="font-serif font-normal italic">technologies</span></span>
        </template>
      </SectionHeader>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SpotlightCard v-for="(group, i) in skillGroups" :key="group.title" v-reveal="(i % 2) * 100" class="p-6 sm:p-7">
          <div class="flex items-center gap-3">
            <Icon :name="group.icon" class="size-5 text-accent" />
            <h3 class="font-semibold tracking-tight">
              {{ group.title }}
            </h3>
            <span class="ml-auto font-mono text-xs text-fg-subtle">{{ String(group.skills.length).padStart(2, '0') }}</span>
          </div>
          <ul class="mt-5 flex flex-wrap gap-2" role="list">
            <li
              v-for="skill in group.skills"
              :key="skill.name"
              class="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:text-fg"
            >
              <Icon :name="skill.icon" class="size-4" />
              {{ skill.name }}
            </li>
          </ul>
        </SpotlightCard>
      </div>
    </section>

    <!-- Education & interests -->
    <section class="container-page grid grid-cols-1 gap-5 md:grid-cols-2" aria-label="Education and interests">
      <div v-reveal class="card p-6 sm:p-8">
        <h2 class="flex items-center gap-3 text-xl font-semibold tracking-tight">
          <Icon name="lucide:graduation-cap" class="size-5 text-accent" />
          Education
        </h2>
        <ol class="mt-6 space-y-5" role="list">
          <li v-for="item in education" :key="item.degree" class="flex items-start justify-between gap-4 border-b border-border pb-5 last:border-0 last:pb-0">
            <div>
              <p class="font-medium">
                {{ item.degree }}, {{ item.field }}
              </p>
              <p class="mt-0.5 text-sm text-fg-muted">
                {{ item.school }}
              </p>
            </div>
            <span class="chip shrink-0">{{ item.year }}</span>
          </li>
        </ol>
      </div>
      <div v-reveal="100" class="card p-6 sm:p-8">
        <h2 class="flex items-center gap-3 text-xl font-semibold tracking-tight">
          <Icon name="lucide:sparkles" class="size-5 text-accent" />
          Beyond the code
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-fg-muted">
          When I’m not shipping features, you’ll find me unwinding with a game, a good playlist or a long chess match.
        </p>
        <ul class="mt-6 grid grid-cols-2 gap-3" role="list">
          <li v-for="interest in profile.interests" :key="interest.label" class="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm">
            <Icon :name="interest.icon" class="size-4 text-accent" />
            {{ interest.label }}
          </li>
        </ul>
      </div>
    </section>

    <ContactCta />
  </div>
</template>
