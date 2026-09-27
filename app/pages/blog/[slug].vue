<script setup lang="ts">
import { profile } from '~/data/profile'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: post, error } = await useFetch<BlogPost>(() => `/api/blog/${slug.value}`, {
  key: `blog-post-${slug.value}`,
})

if (error.value || !post.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage: error.value?.statusCode === 404 || !post.value ? 'Post not found' : 'Could not load this post',
    fatal: true,
  })
}

usePageSeo(() => ({
  title: post.value?.title ?? 'Blog',
  description: post.value?.description ?? '',
  image: post.value?.coverImage,
  type: 'article',
  publishedAt: post.value?.publishedAt,
}))

useHead(() => ({
  link: post.value?.canonicalUrl && !post.value.canonicalUrl.includes('dev.to')
    ? [{ rel: 'canonical', href: post.value.canonicalUrl, key: 'canonical' }]
    : [],
}))

// Other posts for the "keep reading" section
const { data: allPosts } = await useBlogPosts()
const morePosts = computed(() => (allPosts.value ?? []).filter(p => p.slug !== slug.value).slice(0, 2))

// Reading progress + active heading
const articleRef = ref<HTMLElement>()
const { top, height } = useElementBounding(articleRef)
const { height: viewport } = useWindowSize()
const progress = computed(() => {
  if (!height.value) return 0
  return Math.min(1, Math.max(0, -top.value / Math.max(1, height.value - viewport.value)))
})

const activeHeading = ref<string | null>(null)
let observer: IntersectionObserver | undefined
onMounted(() => {
  const headings = post.value?.headings ?? []
  if (!headings.length) return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) activeHeading.value = visible[0].target.id
    },
    { rootMargin: '-15% 0px -70% 0px' },
  )
  for (const heading of headings) {
    const el = document.getElementById(heading.id)
    if (el) observer.observe(el)
  }
})
onBeforeUnmount(() => observer?.disconnect())

const { copy, copied } = useClipboard({ copiedDuring: 2000, legacy: true })
const pageUrl = computed(() => `${profile.siteUrl}/blog/${slug.value}`)
const shareLinks = computed(() => [
  { name: 'X', icon: 'simple-icons:x', url: `https://x.com/intent/post?url=${encodeURIComponent(pageUrl.value)}&text=${encodeURIComponent(post.value?.title ?? '')}` },
  { name: 'LinkedIn', icon: 'simple-icons:linkedin', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}` },
])
</script>

<template>
  <div v-if="post">
    <div class="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />

    <article ref="articleRef" class="relative">
      <HeroBackground />
      <header class="container-page max-w-4xl pt-6 sm:pt-12">
        <NuxtLink v-reveal to="/blog" class="group inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
          <Icon name="lucide:arrow-left" class="size-4 transition-transform group-hover:-translate-x-1" />
          All posts
        </NuxtLink>
        <ul v-if="post.tags.length" v-reveal="60" class="mt-8 flex flex-wrap gap-2" role="list" aria-label="Tags">
          <li v-for="tag in post.tags" :key="tag" class="chip !text-accent">
            #{{ tag }}
          </li>
        </ul>
        <h1 v-reveal="100" class="mt-5 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
          {{ post.title }}
        </h1>
        <p v-if="post.description" v-reveal="140" class="mt-5 text-lg text-pretty text-fg-muted">
          {{ post.description }}
        </p>
        <div v-reveal="180" class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-4 text-sm text-fg-muted">
          <span class="flex items-center gap-2.5">
            <img v-if="post.author.avatar" :src="post.author.avatar" :alt="post.author.name" class="size-7 rounded-full" width="28" height="28">
            <span class="font-medium text-fg">{{ post.author.name }}</span>
          </span>
          <span class="flex items-center gap-1.5"><Icon name="lucide:calendar" class="size-4" /><time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time></span>
          <span class="flex items-center gap-1.5"><Icon name="lucide:clock" class="size-4" />{{ post.readingTime }} min read</span>
          <span class="flex items-center gap-1.5"><Icon name="lucide:heart" class="size-4" />{{ post.reactions }}</span>
        </div>
      </header>

      <div class="container-page mt-10 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
        <div class="min-w-0">
          <img
            v-if="post.coverImage"
            :src="post.coverImage"
            :alt="post.title"
            class="mb-10 w-full rounded-2xl border border-border"
          >
          <!-- eslint-disable-next-line vue/no-v-html -- rendered server-side from markdown with raw HTML disabled -->
          <div class="prose-article prose max-w-none" v-html="post.html" />

          <footer class="mt-16 flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-medium">
                Enjoyed this post?
              </p>
              <p class="mt-1 text-sm text-fg-muted">
                Join the discussion on dev.to ({{ post.comments }} comment{{ post.comments === 1 ? '' : 's' }}) or share it.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a :href="post.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <Icon name="simple-icons:devdotto" class="size-4" />
                Discuss
              </a>
              <a
                v-for="link in shareLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="grid size-10 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                :aria-label="`Share on ${link.name}`"
              >
                <Icon :name="link.icon" class="size-4" />
              </a>
              <button
                type="button"
                class="grid size-10 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                :aria-label="copied ? 'Link copied' : 'Copy link'"
                @click="copy(pageUrl)"
              >
                <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-4" :class="copied ? 'text-accent' : ''" />
              </button>
            </div>
          </footer>
        </div>

        <aside v-if="post.headings.length" class="hidden lg:block">
          <nav class="sticky top-32" aria-label="Table of contents">
            <p class="mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">
              On this page
            </p>
            <ul class="space-y-1 border-l border-border text-sm" role="list">
              <li v-for="heading in post.headings" :key="heading.id">
                <a
                  :href="`#${heading.id}`"
                  class="-ml-px block border-l py-1 transition-colors"
                  :class="[
                    heading.level === 3 ? 'pl-7' : 'pl-4',
                    activeHeading === heading.id ? 'border-accent text-fg' : 'border-transparent text-fg-subtle hover:text-fg',
                  ]"
                >
                  {{ heading.text }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </article>

    <section v-if="morePosts.length" class="container-page mt-28 max-w-6xl" aria-labelledby="more-title">
      <h2 id="more-title" class="mb-8 text-2xl font-semibold tracking-tight">
        Keep <span class="font-serif font-normal italic">reading</span>
      </h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <BlogCard v-for="item in morePosts" :key="item.id" :post="item" />
      </div>
    </section>
  </div>
</template>
