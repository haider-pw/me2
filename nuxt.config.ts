// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/content'
    ],
    runtimeConfig: {
        public: {
            blog: {
                user: 'yuridevat'
            }
        }
    }
})
