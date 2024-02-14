<template>
  <div>
    <span v-for="(item, index) in technologies" :key="index" class="mr-1 mb-1 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
      {{item}}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  tech: String
})

const technologies = computed(() => {
  return props.tech.split(',')
})
</script>
