<template>
  <section class="not-prose font-mono">
    <div class="column text-gray-400 text-sm">
      <div>date</div>
      <div>title</div>
    </div>
    <ul v-for="post in posts" :key="post._path">
      <li>
        <NuxtLink :to="post._path" class="column hover:bg-gray-100 dark:bg-gray-800">
          <div :class="{'text-white dark:text-gray-900': !post.displayYear, 'text-gray-400 dark:text-gray-500':post.displayYear}">{{ post.year }}</div>
          <div>{{ post.title }}</div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
<script setup>
import {useAsyncData} from "#app";

const {data} = await useAsyncData(
    'posts', () => queryContent('/blog')
        .where({_path: {$not: '/blog'}})
        .only(['_path', 'title', 'publishedAt'])
        .sort({publishedAt: -1})
        .find());

const posts = computed(() => {
  if (!data.value)
    return [];

  let lastYear = null;

  return data.value.map((post) => {

    let displayYear = false;
    let year = null;

    if (post.publishedAt) {
      year = new Date(post.publishedAt).getFullYear()
      displayYear = year !== lastYear;
      lastYear = year;
    }

    return {
      ...post,
      displayYear,
      year
    }
  })
})

console.log('data', posts);
</script>


<style scoped>
.column {
  @apply flex items-center space-x-8 py-2 border-b border-gray-200 dark:border-gray-700
}
</style>
