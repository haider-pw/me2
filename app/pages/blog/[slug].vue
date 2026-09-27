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
  author: post.value ? { name: post.value.author.name, url: `https://dev.to/${post.value.author.username}` } : undefined,
}))

// Posts are mirrored from dev.to. Point search engines at the original unless its
// canonical URL is this page (set "Canonical URL" on dev.to to haider.pw/blog/<slug>
// to make this page the one that ranks).
function normalizeUrl(url: string) {
  try {
    const u = new URL(url)
    return `${u.protocol}//${u.host.toLowerCase()}${u.pathname.replace(/\/+$/, '')}`
  }
  catch {
    return null
  }
}
useHead(() => {
  const original = post.value?.canonicalUrl || post.value?.url
  const target = original ? normalizeUrl(original) : null
  return target && target !== normalizeUrl(`${profile.siteUrl}/blog/${slug.value}`)
    ? { link: [{ rel: 'canonical', href: original, key: 'canonical' }] }
    : {}
})

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
      <header class="container-page max-w-4xl pt-10 sm:pt-14">
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
          <div class="prose-article" v-html="post.html" />

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
          <nav class="sticky top-24" aria-label="Table of contents">
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

<!-- Unscoped: applies to the server-rendered article HTML (v-html). Only loaded on post pages. -->
<style>
/* ---------------------------------------------------------------------------
 * Blog article typography (self-contained, no typography plugin needed)
 * ------------------------------------------------------------------------- */
.prose-article {
  color: var(--fg-muted);
  font-size: 1.0625rem;
  line-height: 1.8;
  overflow-wrap: break-word;
}
.prose-article > * + * { margin-top: 1.25em; }
.prose-article :where(h2, h3, h4) {
  color: var(--fg);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
  scroll-margin-top: 5rem;
}
.prose-article h2 { font-size: 1.6em; margin-top: 2em; }
.prose-article h3 { font-size: 1.3em; margin-top: 1.75em; }
.prose-article h4 { font-size: 1.1em; margin-top: 1.5em; }
.prose-article :where(h2, h3, h4) + * { margin-top: 0.75em; }
.prose-article :where(strong, b) { color: var(--fg); font-weight: 600; }
.prose-article a {
  color: var(--fg);
  text-decoration: underline;
  text-decoration-color: color-mix(in oklch, var(--accent) 50%, transparent);
  text-underline-offset: 4px;
  transition: text-decoration-color 0.2s, color 0.2s;
}
.prose-article a:hover { color: var(--accent); text-decoration-color: var(--accent); }
.prose-article :where(ul, ol) { padding-left: 1.5em; }
.prose-article ul { list-style: disc; }
.prose-article ol { list-style: decimal; }
.prose-article li + li { margin-top: 0.4em; }
.prose-article ul > li::marker { color: var(--accent); }
.prose-article ol > li::marker { color: var(--fg-subtle); }
.prose-article hr { border: 0; border-top: 1px solid var(--border); margin: 2.5em 0; }
.prose-article img { max-width: 100%; height: auto; border-radius: 1rem; border: 1px solid var(--border); }
.prose-article :not(pre) > code {
  color: var(--fg);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 0.15em 0.4em;
  font-family: var(--font-mono);
  font-size: 0.875em;
}
.prose-article pre {
  position: relative;
  overflow-x: auto;
  color: var(--fg);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.7;
}
.prose-article pre[data-lang]:not([data-lang="text"])::before {
  content: attr(data-lang);
  position: absolute;
  top: 0.6rem;
  right: 0.9rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-subtle);
}
.prose-article blockquote {
  color: var(--fg);
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
  border-radius: 0 0.75rem 0.75rem 0;
  padding: 0.75rem 1.25rem;
}
.prose-article table { width: 100%; border-collapse: collapse; font-size: 0.925em; display: block; overflow-x: auto; }
.prose-article th { color: var(--fg); font-weight: 600; text-align: left; border-bottom: 1px solid var(--border-strong); padding: 0.5em 0.75em; }
.prose-article td { border-bottom: 1px solid var(--border); padding: 0.5em 0.75em; }

/* Syntax highlighting (highlight.js classes), light + dark */
.hljs-comment, .hljs-quote { color: oklch(0.55 0.02 265); font-style: italic; }
.hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-doctag { color: oklch(0.52 0.2 300); }
.hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta .hljs-string { color: oklch(0.5 0.13 150); }
.hljs-number, .hljs-symbol, .hljs-bullet, .hljs-link { color: oklch(0.58 0.16 45); }
.hljs-title, .hljs-section, .hljs-title.function_ { color: oklch(0.5 0.16 255); }
.hljs-built_in, .hljs-type, .hljs-class .hljs-title, .hljs-title.class_ { color: oklch(0.55 0.13 200); }
.hljs-variable, .hljs-template-variable, .hljs-attr, .hljs-property, .hljs-params { color: oklch(0.5 0.12 25); }
.hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class { color: oklch(0.52 0.16 15); }
.hljs-meta { color: oklch(0.55 0.1 80); }
.hljs-deletion { color: oklch(0.55 0.2 25); }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: 600; }

.dark .hljs-comment, .dark .hljs-quote { color: oklch(0.6 0.02 265); }
.dark .hljs-keyword, .dark .hljs-selector-tag, .dark .hljs-literal, .dark .hljs-doctag { color: oklch(0.78 0.14 300); }
.dark .hljs-string, .dark .hljs-regexp, .dark .hljs-addition, .dark .hljs-attribute, .dark .hljs-meta .hljs-string { color: oklch(0.82 0.13 150); }
.dark .hljs-number, .dark .hljs-symbol, .dark .hljs-bullet, .dark .hljs-link { color: oklch(0.8 0.13 55); }
.dark .hljs-title, .dark .hljs-section, .dark .hljs-title.function_ { color: oklch(0.8 0.12 255); }
.dark .hljs-built_in, .dark .hljs-type, .dark .hljs-class .hljs-title, .dark .hljs-title.class_ { color: oklch(0.82 0.1 200); }
.dark .hljs-variable, .dark .hljs-template-variable, .dark .hljs-attr, .dark .hljs-property, .dark .hljs-params { color: oklch(0.8 0.1 30); }
.dark .hljs-tag, .dark .hljs-name, .dark .hljs-selector-id, .dark .hljs-selector-class { color: oklch(0.78 0.13 15); }
.dark .hljs-meta { color: oklch(0.8 0.1 85); }
.dark .hljs-deletion { color: oklch(0.72 0.17 25); }
</style>
