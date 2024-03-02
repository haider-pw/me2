<template>
  <section class="not-prose font-mono">
    <div class="mb-7">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900"> Top Blog Posts </h1>
      <h3 class="text-xl italic text-gray-600 pl-2 mt-2">Everyday Coding: From Problems to Solutions</h3>
    </div>
    <div class="column text-gray-400 text-sm">
      <div class="w-1/12">date</div>
      <div class="flex-1">title</div>
    </div>
        <ul v-for="post in posts" :key="post.id">
          <li>
            <NuxtLink :to="`/blog/${post.slug}`" class="column hover:bg-gray-100 dark:bg-gray-800">
              <div
                  class="text-gray-400 dark:text-gray-500 w-0.5/4">
                {{ post.publishedDateTime?.date }}
              </div>
              <div class="flex-1">{{ post.title }}</div>
            </NuxtLink>
          </li>
        </ul>
  </section>
</template>
<script setup>
const props = defineProps(['posts'])
useHead({
  title: 'Blog Posts | haider.pw',
  meta: [
    { name: 'description', content: 'Everyday Coding: From Problems to Solutions' }
  ],
})
</script>

<style scoped>
.column {
  @apply flex items-center space-x-8 py-2 border-b border-gray-200 dark:border-gray-700
}
</style>
