<template>
  <li class="relative flex items-baseline gap-6 pb-5 timeline-item cursor-pointer hover:bg-gray-100">
    <div class="before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" class="bi bi-circle-fill fill-gray-400 relative z-10"
           :style="`fill: var(--circle-fill-color, #9ca3af);`"
           viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8"/>
      </svg>
    </div>
    <div>
      <p class="text-sm font-bold text-gray-900">{{ experience.position }}</p>
      <p class="text-sm text-gray-900">{{ experience.title }}</p>
      <p class="text-sm text-gray-600 italic">{{ dateRendered }}</p>
      <p class="mt-2 text-gray-600 text-sm px-4" v-html="experience.description" />
    </div>
  </li>
</template>
<script setup>
const props = defineProps(['experience'])

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
  const {dateOfJoining, dateOfTermination, activelyEmployed} = props.experience;
  if (!dateOfJoining) return;

  const joiningDateFormatted = formatWorkDate(dateOfJoining);
  // Determine the second date based on the presence of dateOfTermination or the activelyEmployed flag
  const secondDateFormatted = activelyEmployed ? 'Present' :
      dateOfTermination ? formatWorkDate(dateOfTermination) : '';

  return [joiningDateFormatted, secondDateFormatted].filter(Boolean).join(' - ');
});
</script>

<style scoped>
/* Change the fill color variable on hover */
.timeline-item:hover {
  --circle-fill-color: #4e6b4e; /* red-500 for hover state */
}
</style>
