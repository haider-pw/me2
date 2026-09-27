/** GET /api/blog/:slug — a single dev.to post rendered to HTML, cached for an hour. */
export default defineCachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug || !/^[\w-]+$/.test(slug)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
    }
    try {
      return await fetchPost(event, slug)
    }
    catch (error) {
      if ((error as { statusCode?: number }).statusCode === 404) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' })
      }
      console.error(`[blog] failed to fetch post "${slug}" from dev.to`, error)
      throw createError({ statusCode: 502, statusMessage: 'Could not load this post' })
    }
  },
  {
    name: 'blog-post',
    maxAge: 60 * 60,
    staleMaxAge: 60 * 60 * 24,
    swr: true,
    getKey: event => getRouterParam(event, 'slug') ?? '',
  },
)
