<template>
  <div>
    <!--    <img class="w-full max-h-[50vh] object-cover" src="/img/projects_banner.webp" alt="projects banner">-->
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="mb-7">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900"> My Top Projects </h1>
        <h3 class="text-xl italic text-gray-600 pl-2 mt-2">
          Coding, Creativity, and Collaboration: My Professional Masterpieces.
        </h3>
      </div>
      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
        <div v-for="(project, index) in projects" :key="index" class="group relative">
          <ProjectCard :project="project"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
const {data: projects} = await useAsyncData('projects', () => queryContent('/projects').sort({deliveredAt: -1}).find())
useHead({
  title: 'My Top Projects | haider.pw',
  meta: [
    { name: 'description', content: 'Syed Haider Hassan | Personal Portfolio.' }
  ],
})
</script>
