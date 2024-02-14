<template>
  <div
      class="flex flex-col aspect-h-1 aspect-w-1 w-full overflow-hidden min-h-36 rounded-md bg-gray-200 group-hover:opacity-75 sm:h-48 md:h-60 lg:h-80">
    <img v-if="project.imageSrc" :src="project.imageSrc" :alt="project.imageAlt"
         class="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
    <span v-else class="text-gray-500 font-bold flex items-center justify-center flex-grow text-4xl">
      {{ project.title }}
    </span>
  </div>
  <div class="mt-4 flex justify-between">
    <div>
      <h3 class="text-gray-700">
        <a :href="project.demoUrl">
          <span aria-hidden="true" class="absolute inset-0"/>
          {{ project.title }}
        </a>
      </h3>
      <ProjectCardTech class="mt-2" :tech="project.tech" />
    </div>
  </div>
</template>
<script setup>
defineProps(['project'])
</script>
