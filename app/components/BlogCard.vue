<script setup lang="ts">
defineProps<{ post: BlogPostSummary, compact?: boolean }>()
</script>

<template>
  <SpotlightCard as="article" class="flex h-full flex-col transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-border-strong">
    <div v-if="!compact" class="relative aspect-[2/1] overflow-hidden border-b border-border bg-bg-subtle">
      <img
        v-if="post.coverImage"
        :src="post.coverImage"
        :alt="''"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-700 ease-out-expo group-hover/spot:scale-[1.04]"
      >
      <div v-else class="grid size-full place-items-center bg-[radial-gradient(90%_90%_at_0%_0%,var(--glow-1),transparent_60%),radial-gradient(90%_90%_at_100%_100%,var(--glow-2),transparent_60%)]">
        <Icon name="lucide:pen-line" class="size-8 text-fg-subtle" />
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <div class="flex items-center gap-2 font-mono text-xs text-fg-subtle">
        <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
        <span aria-hidden="true">·</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
      <h3 class="text-lg leading-snug font-semibold tracking-tight text-balance">
        <NuxtLink :to="`/blog/${post.slug}`" class="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
          {{ post.title }}
        </NuxtLink>
      </h3>
      <p v-if="post.description" class="line-clamp-3 text-sm leading-relaxed text-fg-muted">
        {{ post.description }}
      </p>
      <div class="mt-auto flex items-center justify-between gap-3 pt-3">
        <ul v-if="post.tags.length" class="flex flex-wrap gap-1.5" role="list" aria-label="Tags">
          <li v-for="tag in post.tags.slice(0, 3)" :key="tag" class="chip">
            #{{ tag }}
          </li>
        </ul>
        <span class="ml-auto flex shrink-0 items-center gap-1 text-sm font-medium text-fg-muted transition-colors group-hover/spot:text-accent">
          Read
          <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover/spot:translate-x-1" />
        </span>
      </div>
    </div>
  </SpotlightCard>
</template>
