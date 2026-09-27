<template>
  <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden" aria-hidden="true">
    <div class="bg-grid absolute inset-0 mask-radial" />
    <div class="absolute top-[-10%] left-[10%] size-[520px] animate-float rounded-full bg-[var(--glow-1)] blur-[110px] sm:left-[20%]" />
    <div class="absolute top-[5%] right-[5%] size-[440px] animate-float-slow rounded-full bg-[var(--glow-2)] blur-[110px] sm:right-[15%]" />
    <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-bg" />
  </div>
</template>
