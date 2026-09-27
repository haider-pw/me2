<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <NuxtLink to="/" class="group inline-flex items-center gap-2.5 rounded-full" aria-label="Home">
    <span
      class="relative grid size-8 place-items-center overflow-hidden rounded-[10px] bg-fg font-mono text-[13px] font-semibold text-bg transition-transform duration-500 ease-spring group-hover:rotate-[-8deg] group-hover:scale-105"
    >
      <span class="absolute inset-0 bg-[conic-gradient(from_180deg,var(--accent),var(--accent-2),var(--accent))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span class="relative">{{ profile.initials }}</span>
    </span>
    <span class="font-mono text-sm font-medium tracking-tight">
      haider<span class="text-accent">.</span>pw
    </span>
  </NuxtLink>
</template>
