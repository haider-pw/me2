<template>
  <!-- Radial gradients instead of blur() filters: same soft glow, far cheaper to paint. -->
  <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden" aria-hidden="true">
    <div class="bg-grid absolute inset-0 mask-radial" />
    <div
      class="absolute top-[-25%] left-[-10%] size-[900px] animate-float will-change-transform sm:left-[5%]"
      style="background: radial-gradient(closest-side, var(--glow-1), transparent)"
    />
    <div
      class="absolute top-[-15%] right-[-15%] size-[800px] animate-float-slow will-change-transform sm:right-0"
      style="background: radial-gradient(closest-side, var(--glow-2), transparent)"
    />
    <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-bg" />
  </div>
</template>
