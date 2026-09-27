/** GET /api/blog — list of dev.to posts, cached for an hour. */
export default defineCachedEventHandler(
  async (event) => {
    try {
      return await fetchPosts(event)
    }
    catch (error) {
      console.error('[blog] failed to fetch posts from dev.to', error)
      throw createError({ statusCode: 502, statusMessage: 'Could not load blog posts' })
    }
  },
  { name: 'blog-posts', maxAge: 60 * 60, staleMaxAge: 60 * 60 * 24, swr: true },
)
