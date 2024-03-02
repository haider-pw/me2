<template>
  <section class="not-prose font-mono">
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
</script>

<style scoped>
.column {
  @apply flex items-center space-x-8 py-2 border-b border-gray-200 dark:border-gray-700
}
</style>
