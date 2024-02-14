<template>
  <div class="container mx-auto max-w-5xl font-mono">
    <Header />
    <main class="p-2 mt-10 flex-auto">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import Header from "~/components/Header.vue";
</script>
