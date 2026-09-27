<script setup lang="ts">
import { profile } from '~/data/profile'

const { copy, copied } = useClipboard({ copiedDuring: 2000, legacy: true })
</script>

<template>
  <button type="button" class="btn btn-secondary group" :aria-label="`Copy email address ${profile.email}`" @click="copy(profile.email)">
    <span class="relative grid size-4 place-items-center">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-spring"
        enter-from-class="scale-0 opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="scale-0 opacity-0"
      >
        <Icon v-if="copied" key="check" name="lucide:check" class="size-4 text-accent" />
        <Icon v-else key="copy" name="lucide:copy" class="size-4" />
      </Transition>
    </span>
    <span>{{ copied ? 'Copied to clipboard' : profile.email }}</span>
    <span class="sr-only" aria-live="polite">{{ copied ? 'Email copied' : '' }}</span>
  </button>
</template>
