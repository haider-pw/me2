// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/content'
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
