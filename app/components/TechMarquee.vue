<script setup lang="ts">
import { marqueeSkills } from '~/data/skills'
</script>

<template>
  <div class="group relative flex overflow-hidden mask-fade-x" aria-label="Technologies I work with">
    <ul
      v-for="copy in 2"
      :key="copy"
      class="flex shrink-0 animate-marquee items-center gap-3 pr-3 group-hover:[animation-play-state:paused]"
      style="--marquee-duration: 50s"
      :aria-hidden="copy === 2"
      role="list"
    >
      <li
        v-for="skill in marqueeSkills"
        :key="skill.name"
        class="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm whitespace-nowrap text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
      >
        <Icon :name="skill.icon" class="size-4" />
        {{ skill.name }}
      </li>
    </ul>
  </div>
</template>
