<template>
  <li class="flex gap-4">
    <div
        class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
      <img :alt="work.title" loading="lazy" width="32" height="32" decoding="async" data-nimg="1" class="rounded-full h-7 w-7"
           :src="work.icon || `/img/content/work/placeholder.svg`"
           style="color: transparent;">
    </div>
    <dl class="flex flex-auto flex-wrap gap-x-2">
      <dt class="sr-only">Company</dt>
      <dd class="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {{ work.title }}
      </dd>
      <dt class="sr-only">Role</dt>
      <dd class="text-xs text-zinc-500 dark:text-zinc-400">
        {{ work.position }}
      </dd>
      <dt class="sr-only">Date</dt>
      <dd class="ml-auto text-xs text-zinc-400 dark:text-zinc-500" aria-label="2019 until Present">
        {{dateRendered}}
<!--        <time datetime="2019">2019</time>-->
<!--        <span aria-hidden="true">—</span>-->
<!--        <time datetime="2024">Present</time>-->
      </dd>
    </dl>
  </li>
</template>
<script setup>
const props = defineProps(['work'])

const formatWorkDate = (dateString) => {
  // Create a new Date object using the dateString
  // Adding "-01" to specify the first day of the month for complete date format
  const dateObj = new Date(dateString + "-01");

  // Use toLocaleDateString to format the date as "Month YYYY"
  // The 'en-US' locale is used here for English month names, adjust as needed
  return dateObj.toLocaleDateString('en-US', {
    month: 'short', // "short" for abbreviated month name ('Dec')
    year: 'numeric', // "numeric" for the full year
  });
}
const dateRendered = computed(() => {
  const {dateOfJoining, dateOfTermination, activelyEmployed} = props.work;
  if (!dateOfJoining) return;

  const joiningDateFormatted = formatWorkDate(dateOfJoining);
  // Determine the second date based on the presence of dateOfTermination or the activelyEmployed flag
  const secondDateFormatted = activelyEmployed ? 'Present' :
      dateOfTermination ? formatWorkDate(dateOfTermination) : '';

  return [joiningDateFormatted, secondDateFormatted].filter(Boolean).join(' - ');
});
</script>
