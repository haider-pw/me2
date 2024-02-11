<template>
  <div>
    <SpeedInsights/>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {SpeedInsights} from '@vercel/speed-insights/vue';
</script>
