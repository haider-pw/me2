// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    nitro: {
        preset: 'cloudflare-pages',
    },
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/content',
        '@nuxtjs/device',
        '@nuxtjs/sitemap',
    ],
    imports: {
        dirs: ['utils/**']
    },
    site: {
        url: 'https://haider.pw',
        name: 'My Personal Portfolio | haider.pw'
    },
    runtimeConfig: {
        public: {
            blog: {
                user: 'yuridevat'
            }
        }
    }
})
