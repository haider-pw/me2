<script setup lang="ts">
const error = useError();

// defineProps({error: Object})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div class="prose">
      <template v-if="error.statusCode === 404">
        <h1>404!</h1>
        <p>Sorry, that page doesn't exist.</p>
      </template>
      <template v-else>
        <h1>Dang</h1>
        <p>
          <strong>{{ error.message }}</strong>
        </p>
        <p>It looks like something broke.</p>
        <p>Sorry about that.</p>
      </template>
      <p>
        Go back to your
        <a @click="handleError">
          dashboard.
        </a>
      </p>
    </div>
  </NuxtLayout>
</template>
