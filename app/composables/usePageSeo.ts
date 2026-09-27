import { profile } from '~/data/profile'

interface PageSeo {
  title: string
  description: string
  image?: string | null
  type?: 'website' | 'article' | 'profile'
  publishedAt?: string
  /** Article author (defaults to the site owner). */
  author?: { name: string, url: string }
}

const PERSON_ID = `${profile.siteUrl}/#person`

/** Title, description, canonical, Open Graph/Twitter meta and page JSON-LD. */
export function usePageSeo(seo: MaybeRefOrGetter<PageSeo>) {
  const route = useRoute()
  const value = computed(() => toValue(seo))
  const url = computed(() => `${profile.siteUrl}${route.path === '/' ? '' : route.path}`)
  const customImage = computed(() => !!value.value.image)
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
    // Dimensions are only known for the default share image.
    ogImageWidth: () => (customImage.value ? undefined : 1200),
    ogImageHeight: () => (customImage.value ? undefined : 630),
    ogImageAlt: () => value.value.title,
    ogSiteName: profile.name,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: () => value.value.title,
    twitterDescription: () => value.value.description,
    twitterImage: image,
    articlePublishedTime: () => value.value.publishedAt,
  })

  useJsonLd(() => {
    const { title, description, type, publishedAt, author } = value.value
    const page = {
      '@id': `${url.value}#webpage`,
      'url': url.value,
      'name': title,
      description,
      'isPartOf': { '@id': `${profile.siteUrl}/#website` },
    }
    if (type === 'article') {
      return {
        '@type': 'BlogPosting',
        ...page,
        'headline': title,
        'image': image.value,
        'datePublished': publishedAt,
        'author': author ? { '@type': 'Person', ...author } : { '@id': PERSON_ID },
        'mainEntityOfPage': url.value,
      }
    }
    // ProfilePage makes the person the page's subject (helps name searches).
    return type === 'profile'
      ? { '@type': 'ProfilePage', ...page, 'mainEntity': { '@id': PERSON_ID } }
      : { '@type': 'WebPage', ...page, 'about': { '@id': PERSON_ID } }
  })
}
