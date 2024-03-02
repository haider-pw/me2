<template>
  <ul>
    <TimelineExperience :experience="experience" v-for="(experience, index) in timeline" :key="index" />
  </ul>
</template>

<script setup>
const {data:timeline} = await useAsyncData('work', () => queryContent('/work').sort({_path: -1}).find())
console.log('work', timeline)
</script>
