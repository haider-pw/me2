/** Adds blog posts to /sitemap.xml. */
export default defineSitemapEventHandler(async (event) => {
  try {
    const posts = await fetchPosts(event)
    return posts.map(post => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.publishedAt,
    }))
  }
  catch {
    return []
  }
})
