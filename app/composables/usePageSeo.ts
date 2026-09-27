import { profile } from '~/data/profile'

interface PageSeo {
  title: string
  description: string
  image?: string | null
  type?: 'website' | 'article' | 'profile'
  publishedAt?: string
}

/** Title, description, Open Graph and Twitter meta for a page. */
export function usePageSeo(seo: MaybeRefOrGetter<PageSeo>) {
  const route = useRoute()
  const value = computed(() => toValue(seo))
  const url = computed(() => `${profile.siteUrl}${route.path === '/' ? '' : route.path}`)
  const image = computed(() => {
    const src = value.value.image || '/og-image.png'
    return src.startsWith('http') ? src : `${profile.siteUrl}${src}`
  })

  useHead({ link: [{ rel: 'canonical', href: url, key: 'canonical' }] })
  useSeoMeta({
    title: () => value.value.title,
    description: () => value.value.description,
    ogTitle: () => value.value.title,
    ogDescription: () => value.value.description,
    ogType: () => value.value.type ?? 'website',
    ogUrl: url,
    ogImage: image,
    ogSiteName: profile.name,
    twitterCard: 'summary_large_image',
    twitterTitle: () => value.value.title,
    twitterDescription: () => value.value.description,
    twitterImage: image,
    articlePublishedTime: () => value.value.publishedAt,
  })
}
