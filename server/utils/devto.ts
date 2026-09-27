import type { H3Event } from 'h3'

/** Subset of the dev.to article payload we rely on. */
interface DevToArticle {
  id: number
  title: string
  description: string | null
  slug: string
  path: string
  url: string
  canonical_url: string | null
  cover_image: string | null
  published_at: string
  published_timestamp?: string
  reading_time_minutes: number
  public_reactions_count: number
  comments_count: number
  // dev.to returns tags as an array on list endpoints and as a string on the
  // single-article endpoint (and `tags` the other way round), so accept both.
  tag_list: string[] | string
  tags: string[] | string
  body_markdown?: string
  user: {
    name: string
    username: string
    profile_image_90?: string | null
  }
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return value.split(',').map(t => t.trim()).filter(Boolean)
  return []
}

function devtoFetch<T>(event: H3Event, path: string, query?: Record<string, string | number>) {
  const { blog } = useRuntimeConfig(event)
  return $fetch<T>(path, {
    baseURL: blog.apiBase,
    query,
    timeout: 8000,
    headers: {
      // dev.to rejects requests without a User-Agent.
      'User-Agent': 'haider.pw (+https://haider.pw)',
      'Accept': 'application/vnd.forem.api-v1+json',
    },
  })
}

export function toSummary(article: DevToArticle): BlogPostSummary {
  return {
    id: article.id,
    slug: article.slug || article.path.split('/').pop() || String(article.id),
    title: article.title,
    description: article.description ?? '',
    coverImage: article.cover_image,
    tags: toTags(Array.isArray(article.tag_list) ? article.tag_list : article.tags),
    publishedAt: article.published_timestamp || article.published_at,
    readingTime: article.reading_time_minutes || 1,
    reactions: article.public_reactions_count ?? 0,
    comments: article.comments_count ?? 0,
    url: article.url,
  }
}

export async function fetchPosts(event: H3Event): Promise<BlogPostSummary[]> {
  const username = useRuntimeConfig(event).public.blog.user
  const articles = await devtoFetch<DevToArticle[]>(event, '/articles', { username, per_page: 100 })
  return articles.map(toSummary)
}

export async function fetchPost(event: H3Event, slug: string): Promise<BlogPost> {
  const username = useRuntimeConfig(event).public.blog.user
  const article = await devtoFetch<DevToArticle>(event, `/articles/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`)
  const { html, headings } = renderMarkdown(article.body_markdown ?? '')
  return {
    ...toSummary(article),
    // single-article endpoint: `tags` is the array
    tags: toTags(Array.isArray(article.tags) ? article.tags : article.tag_list),
    html,
    headings,
    canonicalUrl: article.canonical_url,
    author: {
      name: article.user.name,
      username: article.user.username,
      avatar: article.user.profile_image_90 ?? null,
    },
  }
}
