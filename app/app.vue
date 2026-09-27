<script setup lang="ts">
import { profile } from '~/data/profile'

useHead({
  titleTemplate: title => (!title ? `${profile.name} — ${profile.role}` : title.includes(profile.name) ? title : `${title} · ${profile.name}`),
  script: [
    // Mark JS as available before first paint so reveal animations never flash.
    { innerHTML: 'document.documentElement.classList.add(\'js\')', tagPosition: 'head' },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': profile.name,
        'jobTitle': profile.currentTitle,
        'url': profile.siteUrl,
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
