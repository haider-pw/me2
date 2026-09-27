<script setup lang="ts">
import { profile } from '~/data/profile'

withDefaults(defineProps<{ withEmail?: boolean }>(), { withEmail: true })
</script>

<template>
  <ul class="flex items-center gap-1" role="list">
    <li v-for="social in profile.socials" :key="social.name">
      <a
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        class="grid size-10 place-items-center rounded-full text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-2 hover:text-fg"
        :aria-label="`${social.name} (${social.handle})`"
      >
        <Icon :name="social.icon" class="size-[18px]" />
      </a>
    </li>
    <li v-if="withEmail">
      <a
        :href="`mailto:${profile.email}`"
        class="grid size-10 place-items-center rounded-full text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-2 hover:text-fg"
        :aria-label="`Email ${profile.email}`"
      >
        <Icon name="lucide:mail" class="size-[18px]" />
      </a>
    </li>
  </ul>
</template>
