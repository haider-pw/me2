<template>
  <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
    <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round"
           stroke-linejoin="round" aria-hidden="true" class="h-6 w-6 flex-none">
        <path d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
              class="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"></path>
        <path
            d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
            class="stroke-zinc-400 dark:stroke-zinc-500"></path>
      </svg>
      <span class="ml-3">Work</span></h2>
    <ol class="mt-6 space-y-4">
      <WidgetWorkItem class="flex gap-4" :work="work" v-for="(work, index) in timeline" :key="index"/>
    </ol>
    <NuxtLink to="/work"
              class="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70 group mt-6 w-full">
      Read More
    </NuxtLink>
  </div>
</template>
<script setup>
const {data: timeline} = await useAsyncData('work', () => queryContent('/work').limit(4).sort({_path: -1}).find())
</script>
