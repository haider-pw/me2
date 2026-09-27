<script setup lang="ts">
import geistFont from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import serifItalicFont from '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2?url'
import { profile } from '~/data/profile'

useHead({
  // Preload the fonts used in the hero heading (the largest element on first paint).
  link: [geistFont, serifItalicFont].map(href => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossorigin: '' })),
  titleTemplate: title => (!title ? `${profile.name} — ${profile.role}` : title.includes(profile.name) ? title : `${title} · ${profile.name}`),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': profile.name,
        'jobTitle': profile.currentTitle,
        'url': profile.siteUrl,
        ...(profile.avatar ? { image: `${profile.siteUrl}${profile.avatar}` } : {}),
        'email': `mailto:${profile.email}`,
        'address': { '@type': 'PostalAddress', 'addressLocality': 'Islamabad', 'addressCountry': 'PK' },
        'sameAs': profile.socials.map(s => s.url),
        'knowsAbout': ['Vue.js', 'Nuxt', 'TypeScript', 'PHP', 'Laravel', 'E-commerce', 'Magento'],
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
