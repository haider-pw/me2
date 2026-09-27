<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  link?: { label: string, to: string }
  as?: 'h1' | 'h2'
}>()
</script>

<template>
  <div class="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
    <div class="max-w-2xl space-y-4">
      <p v-if="eyebrow" v-reveal class="eyebrow">
        <span class="h-px w-6 bg-accent" aria-hidden="true" />
        {{ eyebrow }}
      </p>
      <component
        :is="as ?? 'h2'"
        v-reveal="60"
        class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </component>
      <p v-if="description || $slots.description" v-reveal="120" class="text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
        <slot name="description">
          {{ description }}
        </slot>
      </p>
    </div>
    <NuxtLink
      v-if="link"
      v-reveal="160"
      :to="link.to"
      class="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
    >
      {{ link.label }}
      <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </NuxtLink>
  </div>
</template>
