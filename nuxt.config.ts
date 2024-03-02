// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/content',
        '@nuxtjs/device',
    ],
    imports: {
        dirs: ['utils/**']
    },
    runtimeConfig: {
        public: {
            blog: {
                user: 'yuridevat'
            }
        }
    }
})
