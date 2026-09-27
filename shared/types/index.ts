/**
 * Types shared between the Vue app (app/) and the Nitro server (server/).
 * Nuxt 4 auto-imports everything exported from shared/types.
 */

export interface BlogPostSummary {
  id: number
  slug: string
  title: string
  description: string
  coverImage: string | null
  tags: string[]
  publishedAt: string
  readingTime: number
  reactions: number
  comments: number
  url: string
}

export interface BlogHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface BlogPost extends BlogPostSummary {
  html: string
  headings: BlogHeading[]
  canonicalUrl: string | null
  author: {
    name: string
    username: string
    avatar: string | null
  }
}
