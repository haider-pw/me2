/** GET /api/blog?limit=n — list of dev.to posts, cached for an hour. */
export default defineCachedEventHandler(
  async (event) => {
    const limit = Number(getQuery(event).limit) || undefined
    try {
      const posts = await fetchPosts(event)
      return limit ? posts.slice(0, Math.min(limit, 50)) : posts
    }
    catch (error) {
      console.error('[blog] failed to fetch posts from dev.to', error)
      throw createError({ statusCode: 502, statusMessage: 'Could not load blog posts' })
    }
  },
  { name: 'blog-posts', maxAge: 60 * 60, staleMaxAge: 60 * 60 * 24, swr: true },
)
