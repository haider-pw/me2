import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/color-mode', '@nuxt/icon', '@vueuse/nuxt', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#fafafa', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    storageKey: 'haider-color-mode',
  },

  icon: {
    mode: 'svg',
    serverBundle: false,
    clientBundle: {
      // Scan .ts too, so icon names referenced in app/data/* get bundled
      scan: { globInclude: ['app/**/*.{vue,ts}'] },
      includeCustomCollections: true,
    },
  },

  site: {
    url: 'https://haider.pw',
    name: 'Syed Haider Hassan',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  runtimeConfig: {
    blog: {
      // Override with NUXT_BLOG_API_BASE (useful for local mocks)
      apiBase: 'https://dev.to/api',
    },
    public: {
      contact: {
        // Web3Forms access key (public by design). Set NUXT_PUBLIC_CONTACT_WEB3FORMS_KEY.
        // When empty, the contact form falls back to opening the visitor's email app.
        web3formsKey: '',
      },
      blog: {
        // Your dev.to username. Override with NUXT_PUBLIC_BLOG_USER
        user: 'yuridevat',
      },
    },
  },

  routeRules: {
    '/about': { prerender: true },
    '/work': { prerender: true },
    '/projects': { prerender: true },
  },

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  typescript: {
    strict: true,
  },
})
