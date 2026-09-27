<script setup lang="ts">
const blogUser = useRuntimeConfig().public.blog.user

usePageSeo({
  title: 'Blog',
  description: 'Everyday coding, from problems to solutions: articles on Vue, Nuxt, PHP, Laravel and web development.',
})

const { data: posts, error, status, refresh } = await useBlogPosts()

const search = ref('')
const activeTag = ref<string | null>(null)

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts.value ?? []) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tag]) => tag)
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return (posts.value ?? []).filter(post =>
    (!activeTag.value || post.tags.includes(activeTag.value))
    && (!q || `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase().includes(q)),
  )
})

const isFiltering = computed(() => !!search.value.trim() || !!activeTag.value)
const featured = computed(() => (isFiltering.value ? null : filtered.value[0] ?? null))
const rest = computed(() => (featured.value ? filtered.value.slice(1) : filtered.value))

function clearFilters() {
  search.value = ''
  activeTag.value = null
}
</script>

<template>
  <div class="space-y-28 sm:space-y-36">
    <section class="relative" aria-labelledby="blog-title">
      <HeroBackground />
      <div class="container-page pt-6 sm:pt-12">
        <SectionHeader as="h1" eyebrow="Blog" description="Everyday coding, from problems to solutions. Notes on the web stack I work with every day.">
          <template #title>
            <span id="blog-title">Thoughts, notes & <span class="font-serif font-normal italic">tutorials</span></span>
          </template>
        </SectionHeader>

        <!-- Error state -->
        <div v-if="error" v-reveal class="card flex flex-col items-center px-6 py-16 text-center">
          <span class="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
            <Icon name="lucide:cloud-off" class="size-6" />
          </span>
          <h2 class="mt-5 text-xl font-semibold">
            Couldn’t load posts right now
          </h2>
          <p class="mt-2 max-w-md text-sm text-fg-muted">
            The posts are fetched from dev.to, which didn’t respond. Try again in a moment, or read them there directly.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" class="btn btn-primary" :disabled="status === 'pending'" @click="refresh()">
              <Icon name="lucide:refresh-cw" class="size-4" :class="status === 'pending' ? 'animate-spin' : ''" />
              Try again
            </button>
            <a :href="`https://dev.to/${blogUser}`" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <Icon name="simple-icons:devdotto" class="size-4" />
              Open on dev.to
            </a>
          </div>
        </div>

        <template v-else>
          <!-- Toolbar -->
          <div v-reveal="160" class="-mt-4 mb-10 space-y-4">
            <label class="relative block max-w-md">
              <span class="sr-only">Search posts</span>
              <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-subtle" />
              <input
                v-model="search"
                type="search"
                placeholder="Search articles…"
                class="h-11 w-full rounded-full border border-border bg-surface pr-4 pl-11 text-sm transition-colors outline-none placeholder:text-fg-subtle focus:border-accent focus:ring-4 focus:ring-accent-soft"
              >
            </label>
            <div v-if="tags.length" class="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap" role="group" aria-label="Filter by tag">
              <button
                v-for="tag in tags"
                :key="tag"
                type="button"
                class="shrink-0 rounded-full border px-3 py-1 font-mono text-xs transition-all duration-300"
                :class="activeTag === tag ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg'"
                :aria-pressed="activeTag === tag"
                @click="activeTag = activeTag === tag ? null : tag"
              >
                #{{ tag }}
              </button>
            </div>
          </div>

          <!-- Featured post -->
          <SpotlightCard
            v-if="featured"
            v-reveal="200"
            as="article"
            class="mb-6 grid transition-all duration-500 ease-out-expo hover:border-border-strong md:grid-cols-[1.2fr_1fr]"
          >
            <div class="relative aspect-[2/1] overflow-hidden border-b border-border bg-bg-subtle md:aspect-auto md:border-r md:border-b-0">
              <img
                v-if="featured.coverImage"
                :src="featured.coverImage"
                alt=""
                class="size-full object-cover transition-transform duration-700 ease-out-expo group-hover/spot:scale-[1.03]"
              >
              <div v-else class="grid size-full min-h-56 place-items-center bg-[radial-gradient(90%_90%_at_0%_0%,var(--glow-1),transparent_60%),radial-gradient(90%_90%_at_100%_100%,var(--glow-2),transparent_60%)]">
                <Icon name="lucide:pen-line" class="size-10 text-fg-subtle" />
              </div>
            </div>
            <div class="flex flex-col gap-4 p-6 sm:p-8">
              <span class="eyebrow">Latest post</span>
              <h2 class="text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
                <NuxtLink :to="`/blog/${featured.slug}`" class="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
                  {{ featured.title }}
                </NuxtLink>
              </h2>
              <p class="line-clamp-4 text-fg-muted">
                {{ featured.description }}
              </p>
              <div class="mt-auto flex items-center gap-2 pt-2 font-mono text-xs text-fg-subtle">
                <time :datetime="featured.publishedAt">{{ formatDate(featured.publishedAt) }}</time>
                <span aria-hidden="true">·</span>
                <span>{{ featured.readingTime }} min read</span>
              </div>
            </div>
          </SpotlightCard>

          <!-- Grid -->
          <div v-if="rest.length" class="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="(post, i) in rest" :key="post.id" v-reveal="(i % 3) * 80">
              <BlogCard :post="post" />
            </div>
          </div>

          <div v-else-if="!featured" class="card flex flex-col items-center px-6 py-16 text-center">
            <Icon name="lucide:search-x" class="size-8 text-fg-subtle" />
            <p class="mt-4 font-medium">
              {{ isFiltering ? 'No posts match your filters' : 'No posts yet — check back soon' }}
            </p>
            <button v-if="isFiltering" type="button" class="btn btn-secondary mt-5" @click="clearFilters">
              Clear filters
            </button>
          </div>

          <p class="mt-12 flex items-center justify-center gap-2 text-sm text-fg-subtle">
            <Icon name="simple-icons:devdotto" class="size-4" />
            Posts are also published on
            <a :href="`https://dev.to/${blogUser}`" target="_blank" rel="noopener noreferrer" class="text-fg-muted underline decoration-border-strong underline-offset-4 hover:text-fg">dev.to</a>
          </p>
        </template>
      </div>
    </section>
  </div>
</template>
