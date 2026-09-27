<script setup lang="ts">
const props = defineProps<{ name: string, logo: string | null, size?: 'sm' | 'md' }>()
const initials = computed(() => props.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase())
</script>

<template>
  <span
    class="grid shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-white shadow-sm"
    :class="size === 'sm' ? 'size-9' : 'size-12'"
  >
    <img v-if="logo" :src="logo" :alt="`${name} logo`" loading="lazy" decoding="async" class="size-[70%] object-contain">
    <span v-else class="font-mono text-xs font-semibold text-zinc-700">{{ initials }}</span>
  </span>
</template>
