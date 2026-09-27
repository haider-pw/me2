<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: is404.value ? 'Page not found' : 'Something went wrong' })
useSeoMeta({ robots: 'noindex' })

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <section class="relative">
      <HeroBackground />
      <div class="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p class="font-mono text-sm text-accent">
          Error {{ error.statusCode }}
        </p>
        <h1 class="mt-4 text-[5rem] leading-none font-semibold tracking-tighter sm:text-[9rem]">
          <span class="text-gradient">{{ is404 ? '404' : 'Oops' }}</span>
        </h1>
        <p class="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          {{ is404 ? 'This page wandered off.' : 'Something broke on my end.' }}
        </p>
        <p class="mt-3 max-w-md text-fg-muted">
          {{ is404
            ? 'The page you’re looking for doesn’t exist or has been moved.'
            : (error.statusMessage || 'An unexpected error occurred. Please try again in a moment.') }}
        </p>
        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" class="btn btn-primary" @click="handleError">
            <Icon name="lucide:house" class="size-4" />
            Back to home
          </button>
          <NuxtLink to="/blog" class="btn btn-secondary">
            Read the blog
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
