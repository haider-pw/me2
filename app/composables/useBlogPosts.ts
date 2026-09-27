/** dev.to posts via the cached /api/blog endpoint. Shared across pages by key. */
export function useBlogPosts() {
  return useFetch<BlogPostSummary[]>('/api/blog', {
    key: 'blog-posts',
    default: () => [],
  })
}
