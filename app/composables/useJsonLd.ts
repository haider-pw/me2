/** Adds a page-level JSON-LD block (merged with the site-wide graph from app.vue). */
export function useJsonLd(data: MaybeRefOrGetter<Record<string, unknown> | null | undefined>) {
  useHead(() => {
    const value = toValue(data)
    if (!value) return {}
    return {
      script: [{
        key: 'ld-page',
        type: 'application/ld+json',
        // Escape "<" so content (e.g. a post title) can never close the script tag.
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...value }).replace(/</g, '\\u003c'),
      }],
    }
  })
}
