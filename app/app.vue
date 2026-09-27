<script setup lang="ts">
import geistFont from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import serifItalicFont from '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2?url'
import { education, profile } from '~/data/profile'
import { experience } from '~/data/experience'

const PERSON_ID = `${profile.siteUrl}/#person`
const current = experience[0]!

useHead({
  // Preload the fonts used in the hero heading (the largest element on first paint).
  link: [geistFont, serifItalicFont].map(href => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossorigin: '' })),
  titleTemplate: title => (!title ? `${profile.name} — ${profile.role}` : title.includes(profile.name) ? title : `${title} · ${profile.name}`),
  script: [
    {
      key: 'ld-site',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            // Tells Google which name to show for the site in results.
            '@type': 'WebSite',
            '@id': `${profile.siteUrl}/#website`,
            'url': profile.siteUrl,
            'name': profile.name,
            'alternateName': ['haider.pw', `${profile.firstName} — ${profile.role}`],
            'inLanguage': 'en',
            'publisher': { '@id': PERSON_ID },
          },
          {
            '@type': 'Person',
            '@id': PERSON_ID,
            'name': profile.name,
            'givenName': 'Syed Haider',
            'familyName': 'Hassan',
            'jobTitle': profile.currentTitle,
            'description': profile.intro,
            'url': profile.siteUrl,
            ...(profile.avatar ? { image: `${profile.siteUrl}${profile.avatar}` } : {}),
            'email': `mailto:${profile.email}`,
            'address': { '@type': 'PostalAddress', 'addressLocality': 'Islamabad', 'addressCountry': 'PK' },
            'worksFor': { '@type': 'Organization', 'name': current.company, ...(current.url ? { url: current.url } : {}) },
            'alumniOf': education.map(e => ({ '@type': 'CollegeOrUniversity', 'name': e.school })),
            'sameAs': profile.socials.map(s => s.url),
            'knowsAbout': ['Vue.js', 'Nuxt', 'TypeScript', 'JavaScript', 'PHP', 'Laravel', 'CodeIgniter', 'Magento 2', 'Vue Storefront', 'Elasticsearch', 'Headless e-commerce', 'CI/CD'],
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <NuxtLoadingIndicator color="var(--accent)" :height="2" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<!-- Loaded as a component style so Nuxt inlines it into the HTML (no render-blocking request). -->
<style src="~/assets/css/main.css"></style>
