<template>
  <section class="container-page" aria-labelledby="cta-title">
    <div v-reveal class="relative isolate overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
      <div class="absolute inset-0 -z-10" aria-hidden="true">
        <div class="bg-grid absolute inset-0 mask-radial" />
        <div class="absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[var(--glow-1)] blur-[100px]" />
      </div>
      <p class="eyebrow justify-center">
        <span class="h-px w-6 bg-accent" aria-hidden="true" />
        Get in touch
        <span class="h-px w-6 bg-accent" aria-hidden="true" />
      </p>
      <h2 id="cta-title" class="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
        Let’s build something <span class="font-serif font-normal text-accent italic">great</span> together.
      </h2>
      <p class="mx-auto mt-5 max-w-lg text-base text-pretty text-fg-muted sm:text-lg">
        Got a role, a project or just want to talk Vue, Nuxt or Laravel? My inbox is always open.
      </p>
      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NuxtLink to="/contact" class="btn btn-primary group !px-6 !py-3">
          <Icon name="lucide:send" class="size-4" />
          Send a message
          <Icon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </NuxtLink>
        <CopyEmailButton class="!py-3" />
      </div>
      <SocialLinks :with-email="false" class="mt-8 justify-center" />
    </div>
  </section>
</template>
